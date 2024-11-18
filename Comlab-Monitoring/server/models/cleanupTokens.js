import mongoose from 'mongoose';
import User from './User.js'; // Adjust the path as necessary
import { v4 as uuidv4 } from 'uuid'; // For generating a unique verification token

const cleanupTokens = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Find users with null verificationToken
    const users = await User.find({ verificationToken: null });
    
    for (let user of users) {
      user.verificationToken = uuidv4(); // Assign a new token
      await user.save(); // Save the updated user
    }

    console.log('Cleanup completed: Updated users with null verification tokens.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};
// Execute the cleanup function
cleanupTokens();