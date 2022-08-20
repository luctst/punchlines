const { promisify } = require('util');
const { randomFill } = require('crypto');

module.exports = async function generateRandomToken(sizeBytes) {
  const createKey = promisify(randomFill);
  return (await createKey(Buffer.alloc(sizeBytes || 16))).toString('hex');
};
