const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const SessionsSchema = new mongoose.Schema(
  {
    token_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    token_refresh: {},
  },
  {
    timestamps: true,
  },
);

SessionsSchema.plugin(deepPopulate);
SessionsSchema.plugin(mongooseLeanVirtuals);

module.exports = SessionsSchema;