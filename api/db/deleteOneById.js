module.exports = function queryDeleteOneById(Model, mid, ops) {
  if (typeof mid !== 'string')
    throw new TypeError('queryDeleteOneById fn first parameter must be object id');

  return Model.findByIdAndDelete(mid, {
    ...(ops && ops.session && { session: ops.session }),
  }).lean();
};
