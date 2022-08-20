const Router = require('express').Router();

const authCtrl = require('@controllers/auth');
const routerWrapper = require('@utils/routerWrapper');
const checkRoutes = require('@middlewares/routeManager');
const userConnected = require('@middlewares/isConnected');

const middlewares = [
  checkRoutes(),
  userConnected(),
];

Router
  .post('/login', middlewares, routerWrapper(authCtrl.Login))
  .post('/register', middlewares, routerWrapper(authCtrl.Register));

module.exports = Router;