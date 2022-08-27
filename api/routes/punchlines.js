const Router = require('express').Router();

const punchlinesCtrl = require('@controllers/punchlines');
const routerWrapper = require('@utils/routerWrapper');
const checkRoutes = require('@middlewares/routeManager');
const userConnected = require('@middlewares/isConnected');

const middlewares = [
  checkRoutes(),
  userConnected(),
];

Router
  .post('/', middlewares, routerWrapper(punchlinesCtrl.create));

module.exports = Router;