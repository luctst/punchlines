const modelsManager = require('@models/index');
const isObject = require('@utils/isObject');
const opsParamsIsGood = require('@utils/opsParamsIsGood');

const aggregate = require('@db/aggregate');
const create = require('@db/create');
const countDocuments = require('@db/countDocuments');
const deleteMany = require('@db/deleteMany');
const findOne = require('@db/findOne');
const findById = require('@db/findById');
const deleteOneById = require('@db/deleteOneById');
const findByIdAndUpdate = require('@db/findByIdAndUpdate');
const find = require('@db/find');

module.exports = function queryManager(modelToUse, fnToCall, fnToCallParams, ops) {
  if (!modelToUse || typeof modelToUse !== 'string')
    throw new TypeError('queryManager first params must be defined and string');
  if (!fnToCall || typeof fnToCall !== 'string')
    throw new TypeError('queryManager fn second parameter must be defined and string');
  if (!fnToCallParams || !Array.isArray(fnToCallParams))
    throw new TypeError('queryManager fn third params must be defined and array');

  const modelToQuery = modelsManager.find((mm) => mm.names.includes(modelToUse));
  const fns = {
    aggregate,
    create,
    countDocuments,
    deleteMany,
    findOne,
    findById,
    deleteOneById,
    findByIdAndUpdate,
    find,
  };

  const paramsToGive = [...fnToCallParams];

  if (!modelToQuery) throw new TypeError('queryManager fn first parameter error');

  paramsToGive.splice(0, 0, modelToQuery.Model);
  paramsToGive.push(ops || {});

  if (!Object.keys(fns).includes(fnToCall))
    throw new TypeError('queryManager fn function trying to call not existed');

  if (fns[fnToCall].length < 2)
    throw new TypeError(
      `queryManager fn, ${fns.fnToCall.name} must have at least two params and first one must be model to attach function`
    );
  if (ops) {
    if (!isObject(ops)) throw new TypeError('queryManager ops params must be an object');
    if (!opsParamsIsGood(ops, modelToQuery.Model.schema.obj))
      throw new TypeError('queryManager ops params error');
  }
  if (paramsToGive.length < 2)
    throw new TypeError(
      `queryManager fnToCall expect at least three params you give ${paramsToGive.length}`
    );

  return fns[fnToCall](...paramsToGive);
};
