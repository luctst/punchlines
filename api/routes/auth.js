const Router = require('express').Router();

const authCtrl = require('@controllers/auth');
const routerWrapper = require('@utils/routerWrapper');
const checkRoutes = require('@middlewares/routeManager');
const userConnected = require('@middlewares/isConnected');
const parseResponse = require('@utils/parseResponse');

function shouldStopIfConnected() {
  return function inner(req, res, next) {
    if (res.locals.session) {
      if (
        req.url === '/login' ||
        req.url === '/register'
      ) {
        return parseResponse(res, { code: 204 });
      }

      return next();
    }

    if (req.url === '/logout') return parseResponse(res, { code: 403 });
    return next();
  }
}

const middlewares = [
  checkRoutes(),
  userConnected({ stopServer: false }),
  shouldStopIfConnected(),
];

Router
  .get('/refresh_token', middlewares, routerWrapper(authCtrl.RefreshToken))
  .post('/login', middlewares, routerWrapper(authCtrl.Login))
  .post('/register', middlewares, routerWrapper(authCtrl.Register))
  .delete('/logout', middlewares, routerWrapper(authCtrl.Logout));

module.exports = Router;