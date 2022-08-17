const isObject = require('@utils/isObject');

module.exports = function queryFindOne(Model, query, ops) {
  if (!isObject(query)) throw new TypeError('queryFindOne params error');

  return Model.findOne(
    { ...query },
    {
      ...(ops && ops.projection && { ...ops.projection }),
    },
    {
      lean: true,
      ...(ops && ops.session && { session: ops.session }),
    }
  );
};
