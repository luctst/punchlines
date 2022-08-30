const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const PunchlinesSchema = new mongoose.Schema(
  {
    punchline: {
      type: String,
      required: true,
      minLength: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    lyrics_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'lyrics',
      required: true,
    },
    likes: {
      type: [
        {
          author: mongoose.Schema.Types.ObjectId,
          liked: {
            type: Number,
            min: 0,
            max: 100,
          },
        }
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

PunchlinesSchema.plugin(deepPopulate);
PunchlinesSchema.plugin(mongooseLeanVirtuals);

PunchlinesSchema.post('save', async function updateUserPunchline() {
  try {
    const doc = this;
    await mongoose.model('users').findByIdAndUpdate(
      doc.author,
      { $push: { punchlines: doc._id }},
      { lean: true, returnDocument: 'after' },
    )
    await mongoose.model('lyrics').findByIdAndUpdate(
      doc.lyrics_id,
      { $push: { punchlines: doc._id } },
      { lean: true, returnDocument: 'after' },
    )
  } catch (error) {
    throw error;
  }
});

PunchlinesSchema.post('findOneAndDelete', async function deletePunchlines(doc) {
  try {
    const dataRemove = [
      { model: 'users', fieldToUpdate: 'punchlines', fieldId: 'author' },
      { model: 'lyrics', fieldToUpdate: 'punchlines', fieldId: 'lyrics_id' },
    ];

    return await Promise.all(
      dataRemove.map(async (drm) => {
        await mongoose.model(drm.model).findByIdAndUpdate(
          doc[drm.fieldId],
          { $pull: { [drm.fieldToUpdate]: { $in: [doc._id] }}},
          { lean: true, returnDocument: 'after' },
        );
      }),
    );
  } catch (error) {
    throw error;
  }
});

module.exports = PunchlinesSchema;