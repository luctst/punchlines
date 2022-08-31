const Router = require('express').Router();

const routerWrapper = require('@utils/routerWrapper');
const lyricsCtrl = require('@controllers/lyrics');
const checkRoutes = require('@middlewares/routeManager');

const middlewares = [
  checkRoutes(),
];

Router
  .get('/', middlewares, routerWrapper(lyricsCtrl.returnLyricRandom))
  .get('/:id', middlewares, routerWrapper(lyricsCtrl.getLyricWithId));

module.exports = Router;