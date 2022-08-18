const parseResponse = require('@utils/parseResponse');

module.exports = function isConnected(ops) {
  const pipe =
    (...fns) =>
      (arg) =>
        fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
  
  return async function inner(req, res, next) {
    try {
      return next();
    } catch (error) {
      return parseResponse(res, error);
    }
  }
}