const isObject = require('@utils/isObject');

module.exports = function countDocuments(Model, query) {
  if (!isObject(query)) throw new TypeError('countDocuments fn parameters error');

  return Model.countDocuments(query);
};
