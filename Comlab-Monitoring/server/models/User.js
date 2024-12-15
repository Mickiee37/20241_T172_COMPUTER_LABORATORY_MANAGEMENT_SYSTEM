// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minlength: 10,
    validate: {
      validator: function (v) {
        const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*-_])/;
        return pattern.test(v);
      },
      message: 'Password must contain at least one uppercase, one lowercase, one number, and one special character (!@#$%^&*-_)',
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{11}$/.test(v); // Allow exactly 11 digits
      },
      message: 'Phone number must be exactly 11 digits.',
    },
    unique: true,
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, sparse: true, unique: true },
  verificationTokenExpires: { type: Date },
});

userSchema.methods.generateVerificationToken = function () {
  this.verificationToken = uuidv4();
  this.verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema, 'users');
export default User;
