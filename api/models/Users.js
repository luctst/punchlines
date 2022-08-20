const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const PasswordValidator = require('password-validator');
const { hashSync } = require('bcrypt');

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
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate: {
        validator(v) {
          const schema = new PasswordValidator();
          return schema
            .is().min(8)
            .has().uppercase(1)
            .has().lowercase(1)
            .has().digits(1)
            .has().not().spaces()
            .validate(v)
        },
        message: (props) => `${props.value} bad format`,
      },
      set(password) {
        return hashSync(password, 10);
      },
    },
    is_verified: {
      type: Boolean,
      default: false,
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