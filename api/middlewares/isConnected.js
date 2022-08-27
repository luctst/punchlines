const { verify } = require('jsonwebtoken');

const parseResponse = require('@utils/parseResponse');
const { cookieRefresh } = require('@/config');
const generateRandomToken = require('@utils/generateRandomToken');
const generateJwt = require('@utils/generateJwt');
const queryDb = require('@db/index');

module.exports = function isConnected(ops = { stopServer: true }) {
  const pipe =
    (...fns) =>
      (arg) =>
        fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
  
  function returnResponse() {
    if (ops.stopServer) throw { code: 401 }
    return false;
  }

  function isHeadersValid(authorizationStr, refreshCookie) {
    return function inner() {
      if (
        !authorizationStr ||
        !refreshCookie
      ) return returnResponse();

      const tokenSplit = authorizationStr.split(' ');
      
      if (tokenSplit.length !== 2) return returnResponse();
      if (tokenSplit[0] !== 'Bearer') return returnResponse();
      if (/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/.test(tokenSplit[1]) === false) return returnResponse();
      
      return tokenSplit[1];
    }
  };

  function isJwtValid(refreshCookie) {
    return function inn(jwt) {
      if (!jwt) return false;
      return verify(
        jwt,
        refreshCookie,
        async function (err, token) {
          if (err) {
            if (err.name === 'TokenExpiredError') return { generateNewJwt: true, refreshToken: refreshCookie }
            return returnResponse();
          }

          return { generateNewJwt: false, sessionId: token.id };
        }
      );
    };
  }

  function getSession(resObj) {
    return async function i(sessionData) {
      if (!sessionData) return false;

      if (!sessionData.generateNewJwt) {
        resObj.locals.session = await queryDb('session', 'findById', [sessionData.sessionId]);
        return true;
      }
      
      const session = await queryDb('session', 'findOne', [{ token_refresh: sessionData.refreshToken}]);
      const newTokenRefresh = await generateRandomToken(8);
      const newJwt = generateJwt({ id: session._id.toString() }, newTokenRefresh);
      resObj.locals.session = await queryDb(
        'session',
        'findByIdAndUpdate',
        [session._id.toString(), { token_refresh: newTokenRefresh}]
      );
      resObj.locals.newJwt = newJwt;

      resObj.cookie(
        cookieRefresh,
        newTokenRefresh,
        {
          httpOnly: true,
          path: '/',
          sameSite: true,
          Secure: true,
        }
      );

      return true;
    }
  };
  
  return async function r(req, res, next) {
    try {
      await pipe(
        isHeadersValid(req.headers.authorization, req.cookies[cookieRefresh]),
        isJwtValid(req.cookies[cookieRefresh]),
        getSession(res),
      )();

      return next();
    } catch (error) {
      return parseResponse(res, error);
    }
  }
}