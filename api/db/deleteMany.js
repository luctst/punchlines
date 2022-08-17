const isObject = require('@utils/isObject');

module.exports = function deleteMany(Model, query, ops) {
  if (!isObject(query)) throw new TypeError('deleteMany query function error parameter');

  return Model.deleteMany(
    { ...query },
    {
      ...(ops && ops.session && { session: ops.session }),
    }
  );
};
