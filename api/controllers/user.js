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
      populate: {
        path: 'punchlines',
        select: 'likes punchline lyrics_id createdAt',
        populate: {
          path: 'lyrics_id',
          select: 'lyrics',
        },
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