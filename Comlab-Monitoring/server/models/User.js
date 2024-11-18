import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Ensure you have uuid installed

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
      message: 'Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-_)',
    },
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, sparse: true, unique: true }, // Allow multiple null values
  verificationTokenExpires: { type: Date },
});

// Method to generate a verification token
userSchema.methods.generateVerificationToken = function () {
  this.verificationToken = uuidv4(); // Generate a unique token
  this.verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // Set expiration time (1 hour)
};

// Method to check if the verification token has expired
userSchema.methods.isVerificationTokenExpired = function () {
  return this.verificationTokenExpires < Date.now(); // Return true if the token has expired
};

// Method to compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User ', userSchema, 'users'); // Ensure the collection name is 'users'

export default User;