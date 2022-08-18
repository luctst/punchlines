const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const LyricsSchema = new mongoose.Schema(
  {
    lyrics: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'artists',
      required: true,
    },
    punchlines: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'punchlines',
        }
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

LyricsSchema.plugin(deepPopulate);
LyricsSchema.plugin(mongooseLeanVirtuals);

LyricsSchema.post('save', async function updateArtisPunchline() {
  try {
    const doc = this;
    await mongoose.model('artists').findByIdAndUpdate(
      doc.artist,
      { $push: { punchlines: doc._id } },
      {
        lean: true,
        returnDocument: 'after',
      }
    )
  } catch (error) {
    throw error;
  }
});

module.exports = LyricsSchema;