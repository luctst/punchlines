const Router = require('express').Router();

const userCtrl = require('@controllers/user');
const routerWrapper = require('@utils/routerWrapper');
const checkRoutes = require('@middlewares/routeManager');

Router
  .get('/:uid', checkRoutes(), routerWrapper(userCtrl.getUser));

module.exports = Router;