const isObject = require('@utils/isObject');
const checkProjection = require('@utils/checkProjection');

module.exports = function opsParamsIsGood(ops, mongooseSchema) {
  if (!ops) throw new TypeError('opsParamsIsGood fn must include at least one params');
  if (!isObject(ops)) return false;

  if (ops.projection) {
    if (!isObject(ops.projection)) return false;
    if (!mongooseSchema) return false;
    if (!checkProjection(mongooseSchema, ops.projection)) return false;
  }

  if (ops.session) {
    if (!isObject(ops.session)) return false;
  }

  return true;
};
