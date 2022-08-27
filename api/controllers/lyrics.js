const dbQuery = require('@db/index');

exports.returnLyricRandom = async function returnlyricrandom(req, res, session) {
  const lyricsLength = await dbQuery('lyrics', 'countDocuments', [{}], { session });
  const quote = await dbQuery(
    'lyrics',
    'findOne',
    [{}],
    { 
      populate: { path: 'artist', select: 'name'},
      skip: Math.floor(Math.random() * lyricsLength),
    }
  );

  if (!quote) {
    return {
      code: 204,
    };
  }

  return {
    code: 200,
    modifyResponse: {
      quote: quote.lyrics,
      artist: quote.artist.name,
      id: quote._id,
    },
  };
};