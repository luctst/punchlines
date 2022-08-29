const queryDb = require('@db/index');

exports.create = async function createPunchline(req, res, session) {
  const punchline = await queryDb('punchlines', 'create', [req.body], { session });
  return {
    code: 200,
    modifyResponse: {
      punchline_id: punchline._id,
    },
  };
}

exports.delete = async function deletePunchline(req, res, session) {
  await queryDb('punchline', 'deleteOneById', [req.params.id], { session });
  return {
    code: 204,
  };
}

exports.addLikes = async function addlikes(req, res, session) {
  return {
    code: 200,
  };
}

exports.getPunchline = async function getpunchline(req, res, session) {
  const punchline = await queryDb(
    'punchline',
    'findById',
    [req.params.id],
    {
      session,
      projection: {
        updatedAt: 0,
        __v: 0,
      },
      populate: {
        path: 'lyrics_id author',
        select: 'select artist lyrics score username',
        populate: {
          path: 'artist',
          select: 'name',
        },
      },
    }
  )

  if (!punchline) {
    return {
      code: 400,
      serverHeader: {
        Location: '/'
      }
    };
  }

  return {
    code: 200,
    modifyResponse: {
      punchline,
    },
  };
}