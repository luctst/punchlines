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
  const errorNotAuthorized = { code: 403 };
  const errorDoNotExist = { code: 400 };
  const punchline = await queryDb(
    'punchline',
    'findById',
    [req.params.id],
    {
      session,
      projection: {
        author: 1,
      },
    }
  );
  
  if (!punchline) 
    return { ...errorDoNotExist };
  if (res.locals.session.token_user_id.toString() !== punchline.author.toString()) 
    return { ...errorNotAuthorized};

  await queryDb('punchline', 'deleteOneById', [req.params.id], { session });
  return {
    code: 204,
  };
}

exports.addLikes = async function addlikes(req, res, session) {
  function calculLikesAndReturnToClient(likesArray, authorId) {
    return likesArray.reduce(
      (prev, next) => {
        const oldPrev = { ...prev };
        
        if (next.author.toString() === authorId) {
          oldPrev.modifyResponse.author_likes = next.liked;
          oldPrev.modifyResponse.liked_id = next._id;
        };

        oldPrev.modifyResponse.total_likes = oldPrev.modifyResponse.total_likes + next.liked;
        return oldPrev;
      },
      {
        code: 200,
        modifyResponse: {
          total_people_likes: likesArray.length,
          total_likes: 0,
          author_likes: 0,
        },
      }
    );
  };

  async function updateUserScore(userId, scoreSend, authorLikes) {
    await queryDb(
      'users',
      'findByIdAndUpdate',
      [
        userId,
        {
          $inc: { score: scoreSend - authorLikes },
        },
      ],
      { session },
    );
  }

  const error = { code: 400 };
  const punchline = await queryDb('punchline', 'findById', [req.params.id], { session });

  if (!punchline) return { ...error };

  const userLikeIndex = punchline.likes.findIndex((likeData) => likeData.author.toString() === req.body.author_id);

  if (userLikeIndex === -1) {
    const newPunchline = await queryDb(
      'punchline',
      'findByIdAndUpdate',
      [
        req.params.id,
        {
          $push: { likes: { author: req.body.author_id, liked: req.body.likes }},
        },
      ],
      { session },
    );
     
    await updateUserScore(req.body.author_id, req.body.likes, 0);
    return calculLikesAndReturnToClient(newPunchline.likes, req.body.author_id);
  }
  
  if (punchline.likes[userLikeIndex].liked >= 100) return { ...error };
  
  const newPunch = await queryDb(
    'punchline',
    'findByIdAndUpdate',
    [
      req.params.id,
      {
        $set: { [`likes.${userLikeIndex}.liked`]: req.body.likes},
      }
    ],
    { session, new: false },
    );
    const punchLikes = await queryDb(
      'punchline',
      'findById',
      [req.params.id],
      {
        session,
        projection: { likes: 1 }
      },
    );
      
  await updateUserScore(req.body.author_id, req.body.likes, newPunch.likes[userLikeIndex].liked);
  return calculLikesAndReturnToClient(punchLikes.likes, req.body.author_id);
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