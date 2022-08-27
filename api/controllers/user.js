const queryDb = require('@db/index');

exports.getUser = async function getuser(req, res, session) {
  const error = { code: 400 };
  const user = await queryDb(
    'user',
    'findById',
    [req.params.uid],
    {
      session,
      projection: {
        email: 1,
        score: 1,
        punchlines: 1,
        username: 1,
      },
    },
  );
  if (!user) return { ...error };

  return {
    code: 200,
    modifyResponse: {
      user,
    }
  };
}