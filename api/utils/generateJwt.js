const { sign } = require('jsonwebtoken');

function jwtExpireIn() {
  return process.env.NODE_ENV === 'production' ? 900 : 600;
};

module.exports = function generateJwt(userId, secretKey) {
  return sign(
    userId,
    secretKey,
    {
      expiresIn: jwtExpireIn(),
    }
  );
}