module.exports = function ownProperty(obj, key) {
  if (!obj || !key) return new TypeError('Params error');
  if (typeof obj !== 'object' || typeof key !== 'string')
    return new TypeError('Params format error');

  return Object.prototype.hasOwnProperty.call(obj, key);
};
