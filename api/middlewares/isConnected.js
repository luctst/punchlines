const parseResponse = require('@utils/parseResponse');
const { cookieRefresh } = require('@/config');

module.exports = function isConnected(ops = { stopServer: false }) {
  const pipe =
    (...fns) =>
      (arg) =>
        fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
  
  function returnResponse() {
    if (ops.stopServer) throw {
      code: 401,
    }
    return false;
  }

  function isHeadersValid(authorizationStr, refreshCookie) {
    return function inner() {
      if (
        !authorizationStr ||
        !refreshCookie
      ) return returnResponse();
    }
  };
  
  return async function inner(req, res, next) {
    try {
      await pipe(
        isHeadersValid(req.headers.authorization, req.cookies[cookieRefresh]),
      );

      return next();
    } catch (error) {
      return parseResponse(res, error);
    }
  }
}