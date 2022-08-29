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
  .get('/:id', middlewares, routerWrapper(punchlinesCtrl.getPunchline))
  .post('/', middlewares, routerWrapper(punchlinesCtrl.create))
  .post('/:id/likes', middlewares, routerWrapper(punchlinesCtrl.addLikes))
  .delete('/:id', middlewares, routerWrapper(punchlinesCtrl.delete));

module.exports = Router;