const isObject = require('@utils/isObject');

module.exports = function queryFindByIdAndUpdate(Model, mid, dataToUpdate, ops) {
  if (typeof mid !== 'string')
    throw new TypeError('findByIdAndUpdate id must be defined');
  if (!isObject(dataToUpdate))
    throw new TypeError(
      'findByIdAndUpdate session fn second parameter must be an object'
    );

  return Model.findByIdAndUpdate(
    mid,
    { ...dataToUpdate },
    {
      ...(ops && ops.projection && { projection: ops.projection }),
      ...(ops && ops.session && { session: ops.session }),
      lean: true,
      returnDocument: 'after',
    }
  );
};
