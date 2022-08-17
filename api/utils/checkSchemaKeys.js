const isObject = require('@utils/isObject');
const ownProperty = require('@utils/ownProperty');

module.exports = function checkSchemaKeys(schemaObj, objToCheck) {
  if (!schemaObj || !objToCheck)
    throw new Error('checkSchemaKeys fn first and second parameter must be defined');
  if (!isObject(schemaObj) || !isObject(objToCheck))
    throw new Error('checkSchemaKeys fn first and second parameter must be object');

  const objtoReturn = {};

  Object.keys(schemaObj).forEach((el) => {
    if (ownProperty(objToCheck, el)) objtoReturn[el] = objToCheck[el];
    if (ownProperty(schemaObj[el], 'default')) return false;
    return true;
  });

  return { ...objtoReturn };
};
