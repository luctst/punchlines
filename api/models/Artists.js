const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const ArtistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    punchlines: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'lyrics',
        }
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

ArtistSchema.plugin(deepPopulate);
ArtistSchema.plugin(mongooseLeanVirtuals);

module.exports = ArtistSchema;