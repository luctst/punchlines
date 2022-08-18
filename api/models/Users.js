const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const PasswordValidator = require('password-validator');

const UsersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator(v) {
          const schema = new PasswordValidator();
          schema.has().not().symbols();

          return schema.validate(v);
        },
        message: (props) => `${props.value}`,
      }
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator(v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
        },
        message: (props) => `${props.value} bad email adress`,
      },
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
    },
    punchlines: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'punchlines',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

UsersSchema.plugin(deepPopulate);
UsersSchema.plugin(mongooseLeanVirtuals);

module.exports = UsersSchema;