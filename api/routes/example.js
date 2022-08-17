const Router = require('express').Router();

const routerWrapper = require('@utils/routerWrapper');
const exampleCtrl = require('@controllers/example');
const checkRoutes = require('@middlewares/routeManager');

const middlewares = [
  checkRoutes(),
];

Router.get('/', middlewares, routerWrapper(exampleCtrl.exampleController));

module.exports = Router;