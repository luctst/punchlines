module.exports = function queryFindById(Model, mid, ops) {
  if (typeof mid !== 'string')
    throw new TypeError('queryFindById fn params must be string');

  return Model.findById(
    mid,
    { ...(ops && ops.projection && { ...ops.projection }) },
    {
      ...(ops && ops.session && { session: ops.session }),
      ...(ops && ops.populate && { populate: ops.populate }),
    }
  ).lean();
};
