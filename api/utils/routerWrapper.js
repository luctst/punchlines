const mongoose = require('mongoose');
const parseResponse = require('@utils/parseResponse');

module.exports = function routerWrapper(fn) {
  if (!fn || typeof fn !== 'function')
    throw new TypeError('routerWrapper fn must include one params');

  return async function innerRouterWrapper(req, res) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const result = await fn.call(this, req, res, session);

      await session.commitTransaction();
      session.endSession();

      return parseResponse(res, result);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return parseResponse(res, error);
    }
  };
};
