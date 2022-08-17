const mongoose = require('mongoose');
const response = require('@utils/responseClient');

module.exports = function connectBdd() {
  return async function innerConnectBdd(req, res, next) {
    if (mongoose.connection.readyState === 1) return next();

    try {
      await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      next();
    } catch (error) {
      return response(res, error);
    }

    return true;
  };
};
