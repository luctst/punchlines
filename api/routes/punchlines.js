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
  .get('/:id', checkRoutes(), routerWrapper(punchlinesCtrl.getPunchline))
  .post('/', middlewares, routerWrapper(punchlinesCtrl.create))
  .delete('/:id', middlewares, routerWrapper(punchlinesCtrl.delete))
  .patch('/:id/likes', middlewares, routerWrapper(punchlinesCtrl.addLikes));

module.exports = Router;