const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const ExampleSchema = new mongoose.Schema(
  {},
);

ExampleSchema.plugin(deepPopulate);
ExampleSchema.plugin(mongooseLeanVirtuals);

module.exports = ExampleSchema;