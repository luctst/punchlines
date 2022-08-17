const isObject = require('@utils/isObject');

module.exports = function queryFind(Model, query, ops) {
  if (!isObject(query)) throw new TypeError('find parameter error');

  return Model.find(
    { ...query },
    {
      ...(ops && ops.projection && { ...ops.projection }),
    },
    {
      ...(ops && ops.session && { session: ops.session }),
      ...(ops && ops.populate && { populate: ops.populate }),
      ...(ops && ops.sort && { sort: ops.sort }),
      ...(ops && ops.skip && { skip: ops.skip }),
      ...(ops && ops.limit && { limit: ops.limit }),
    }
  ).lean({ virtuals: true });
};
