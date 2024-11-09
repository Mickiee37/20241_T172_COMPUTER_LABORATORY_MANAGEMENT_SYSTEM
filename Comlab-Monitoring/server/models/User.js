import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^[\w._%+-]+@buksu\.edu\.ph$/, 'Please enter a valid @buksu.edu.ph email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
});

const User = mongoose.model('User', userSchema);

export default User;
