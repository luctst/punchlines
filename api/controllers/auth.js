const { compare } = require('bcrypt');

const { cookieRefresh } = require('@/config');
const queryDb = require('@db/index');
const generateJwt = require('@utils/generateJwt');

function returnUserToClient(userData) {
  const keysToReturn = [
    '_id',
    'username',
    'jwt',
  ];

  return Object
    .keys(userData)
    .reduce(
      (prev, next) => {
        const oldPrev = { ...prev };
        if (!keysToReturn.includes(next)) return oldPrev;
        oldPrev[next] = userData[next];
        return oldPrev;
      },
      {} 
    );
}

exports.Login = async function login(req, res, session) {
  const error = {
    code: 401,
  };
  const user = await queryDb(
    'users',
    'findOne',
    [{ email: req.body.email }],
    {
      session,
      projection: {
        email: 1,
        password: 1,
        username: 1,
      },
    }
  );

  if (!user) return { ...error };
  if (!await compare(req.body.password, user.password)) return { ...error };

  const newUserSession = await queryDb('session', 'create', [{ token_user_id: user._id }], { session });
  const jwt = generateJwt({ id: newUserSession._id }, newUserSession.token_refresh);

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
      userData: returnUserToClient({ ...user, jwt }),
    },
  };
}

exports.Register = async function register(req, res, session) {
  const user = await queryDb('users', 'findOne', [{ username: req.body.username }]);

  if (user) {
    return {
      code: 409,
      content: res.locals.$t('auth.userAlreadyExist'),
    };
  }

  const newUser = await queryDb('users', 'create', [{ ...req.body }], { session });
  const newUserSession = await queryDb('session', 'create', [{ token_user_id: newUser._id }], { session });
  const jwt = generateJwt({ uid: newUser._id }, newUserSession.token_refresh);
  
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
      userData: returnUserToClient({ ...newUser._doc, jwt }),
    },
  };
}