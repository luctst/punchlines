const Router = require('express').Router();

const userCtrl = require('@controllers/user');
const routerWrapper = require('@utils/routerWrapper');
const checkRoutes = require('@middlewares/routeManager');
const userConnected = require('@middlewares/isConnected');

const middlewares = [
  checkRoutes(),
  userConnected(),
];

Router
  .get('/:uid', middlewares, routerWrapper(userCtrl.getUser));

module.exports = Router;