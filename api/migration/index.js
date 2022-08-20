(async function() {
  require('dotenv').config({ path: '../.env'});
  const mongoose = require('mongoose');
  const queryDb = require('@db/index');
  const isObject = require('@utils/isObject');
  const kanyewest = require('./kanyewest.json');

  async function populateArtistWithQuotes(data) {
    if (
      !data ||
      !isObject(data) ||
      !data.name ||
      !data.quotes
    ) throw new Error('data must be an object with name and quotes properties');

    const artist = await queryDb('artists', 'findOne', [{ name: data.name}]);

    if (!artist) {
      await queryDb('artists', 'create', [{ name: data.name }]);
    }

    await Promise.all(
      await data.quotes.map(async (quote) => {
        return await queryDb('lyrics', 'create', [{ lyrics: quote, artist: artist._id }]);
      }),
    );

    process.stdout.write('populateArtistWithQuotes fn done');
  }

  try {
    if (mongoose.connection.readyState === 1) return true;
    await mongoose.connect(process.env.DB_URL_PROD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await populateArtistWithQuotes(kanyewest);
  } catch (error) {
    process.stderr.write(error.message);
  }
})()