const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const generateRandomToken = require('@utils/generateRandomToken');

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
      async default() {
        return await generateRandomToken();
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