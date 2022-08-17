const isObject = require('@utils/isObject');
const checkSchemaKeys = require('@utils/checkSchemaKeys');

module.exports = function queryCreate(Model, query, ops) {
  if (!isObject(query)) throw new TypeError('queryCreate fn parameter must be an object');

  const dataParsed = checkSchemaKeys(Model.schema.obj, query);
  return new Model({ ...dataParsed }).save({
    ...(ops.session && { session: ops.session }),
  });
};
