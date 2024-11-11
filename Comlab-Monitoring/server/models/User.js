// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Validate the raw password (before hashing)
        const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*-_])/;
        return pattern.test(v); // Ensure raw password meets criteria
      },
      message:
        'Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-_)',
    },
  },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Hash the password using bcrypt before saving it
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword; // Save the hashed password
  }
  next(); // Proceed to save the user
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;
