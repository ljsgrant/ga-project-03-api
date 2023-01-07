import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mongooseHidden from 'mongoose-hidden';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { emailRegex } from '../lib/stringTesters.js';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: (email) => emailRegex.test(email)
    },
    password: {
      type: String,
      required: true,
      validate: (password) =>
        /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          password
        )
    },
    posts: [{ type: mongoose.Types.ObjectId, ref: 'Posts' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comments' }],
    cloudinaryImageId: { type: String }
  },
  { timestamps: true }
);

userSchema.pre('save', function encryptPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(
  mongooseHidden({ defaultHidden: { password: true, email: true } })
);

userSchema.plugin(mongooseUniqueValidator);

export default mongoose.model('User', userSchema);
