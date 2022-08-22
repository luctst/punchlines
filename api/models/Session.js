const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const { randomFillSync } = require('crypto');

const SessionsSchema = new mongoose.Schema(
  {
    token_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    token_refresh: {
      type: String,
      unique: true,
      default() {
        return randomFillSync(Buffer.alloc(8)).toString('hex');
      }
    },
  },
  {
    timestamps: true,
  },
);

SessionsSchema.plugin(deepPopulate);
SessionsSchema.plugin(mongooseLeanVirtuals);

module.exports = SessionsSchema;