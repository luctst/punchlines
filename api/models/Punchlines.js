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
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
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

module.exports = PunchlinesSchema;