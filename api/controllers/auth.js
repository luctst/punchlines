const { hash } = require('bcrypt');

const { cookieRefresh } = require('@/config');
const queryDb = require('@db/index');
const generateJwt = require('@utils/generateJwt');

exports.Login = async function login(req, res) {
  
}

exports.Register = async function register(req, res) {
  const user = await queryDb('users', 'findOne', [{ username: req.body.username }]);
  const keysToDelete = ['password', 'updatedAt', '__v'];

  if (user) {
    return {
      code: 409,
      content: res.locals.$t('auth.userAlreadyExist'),
    };
  }

  const newUser = await queryDb('users', 'create', [{ ...req.body }]);
  const newUserSession = await queryDb('session', 'create', [{ token_user_id: newUser._id }]);
  const jwt = generateJwt(newUser._id, newUserSession.token_refresh);
  const userDataToReturn = Object.keys(newUser._doc).reduce(
    (prev, next) => {
      const oldPrev = { ...prev };
      
      if (keysToDelete.includes(next)) return oldPrev;
      
      oldPrev[next] = newUser[next];
      return oldPrev;
    },
    {},
    );
  
  res.cookie(
    cookieRefresh,
    newUserSession.token_refresh,
    {
      httpOnly: true,
      path: '/',
      sameSite: true,
      Secure: true,
    }
  );
  return {
    code: 200,
    modifyResponse: {
      newUser: {
        ...userDataToReturn,
        jwt,
      },
    },
  };
}