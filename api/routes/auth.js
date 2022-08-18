const Router = require('express').Router();

const authCtrl = require('@controllers/auth');
const routerWrapper = require('@utils/routerWrapper');
const checkRoutes = require('@middlewares/routeManager');

const middlewares = [
  checkRoutes(),
];

Router
  .post('/login', middlewares, routerWrapper(authCtrl.Login));

module.exports = Router;