module.exports = function queryAggregate(Model, query, ops) {
  if (!Array.isArray(query)) throw new TypeError('queryAggregate params error');

  return Model.aggregate(query).session(ops.session);
};
