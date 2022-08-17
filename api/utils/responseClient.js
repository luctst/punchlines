const { returnHttpCode } = require('@/config');

module.exports = (response, code, data = {}) => {
  const httpCode = returnHttpCode(data.content, response.locals.$t);
  const defaultHeader = {
    'Access-Control-Allow-Origin': process.env.CORS,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Authorization ,ETag, Link, Location, Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, x-api-key, Content-Type',
    'Access-Control-Expose-Headers': 'Location',
    'Cache-Control': 'max-age=0, s-maxage=86400',
    'content-type': 'application/json; charset=utf-8',
    'Content-Security-Policy': "default-src 'none'",
    Status: code,
    Vary: 'Origin',
    'X-XSS-Protection': '1;mode=block',
    'Referrer-Policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'deny',
    'X-RateLimit-Limit': 60,
  };

  // Handle specific http code
  switch (code) {
    case 201:
    case 303:
      defaultHeader.Location = process.env.DB_URL;
      break;
    case 204: {
      response.set({
        ...defaultHeader,
        ...data.serverHeader,
      });
      if (data.token) {
        return response.status(code).json({ token: data.token });
      }

      return response.status(code).end();
    }
    case 401:
      defaultHeader['WWW-Authenticate'] = 'Bearer';
      break;
    case 405:
      defaultHeader.Allow = data.content;
      break;
    default:
      break;
  }

  response.set({
    ...defaultHeader,
    ...data.serverHeader,
  });

  if (data.modifyResponse) {
    if (code === 500) {
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
        httpCode[code] = { ...data.modifyResponse };
      }
    } else if (Array.isArray(data.modifyResponse)) {
      httpCode[code] = [...data.modifyResponse];
    } else {
      httpCode[code] = { ...data.modifyResponse };
    }
  }

  if (data.token) {
    httpCode[code].token = data.token;
  }

  response.status(code).json(httpCode[code]);
  return true;
};