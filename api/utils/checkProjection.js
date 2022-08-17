const isObject = require('@utils/isObject');
const ownProperty = require('@utils/ownProperty');

module.exports = function checkProjection(schemaObj, projectionToCheck) {
  if (!schemaObj || !projectionToCheck)
    throw new Error('checkProjection fn first and second parameter must be defined');
  if (!isObject(schemaObj) || !isObject(projectionToCheck))
    throw new Error('checkProjection fn first and second parameter must be object');

  const projectionValuesAsArray = Object.values(projectionToCheck);
  const projectionKeysAsArray = Object.keys(projectionToCheck);
  const schemaParsed = {
    _id: true,
    ...schemaObj,
    __v: true,
    createdAt: true,
    updatedAt: true,
  };

  if (!projectionKeysAsArray.every((el) => ownProperty(schemaParsed, el))) return false;

  if (!projectionValuesAsArray.every((el) => el === projectionValuesAsArray[0]))
    return false;

  return true;
};
