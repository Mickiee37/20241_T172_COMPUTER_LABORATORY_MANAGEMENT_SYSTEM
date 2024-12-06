import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lab from './models/Lab.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB;

const allLabs = Array.from({ length: 10 }, (_, i) => ({
  labNumber: (i + 1).toString(),
  labName: `Comlab ${i + 1}`,
  status: 'closed',
  instructor: null,
  qrValue: `dummyQrValue${i + 1}`,
}));

const seedLabs = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    console.log('Checking for existing labs...');
    const existingLabs = await Lab.find({}, 'labNumber'); // Get existing lab numbers
    const existingLabNumbers = existingLabs.map(lab => lab.labNumber);

    console.log(`Existing labs: ${existingLabNumbers.join(', ')}`);

    // Filter out labs that already exist
    const newLabs = allLabs.filter(lab => !existingLabNumbers.includes(lab.labNumber));

    if (newLabs.length === 0) {
      console.log('No new labs to insert. All labs already exist.');
    } else {
      console.log(`Inserting new labs: ${newLabs.map(lab => lab.labNumber).join(', ')}`);
      const insertedLabs = await Lab.insertMany(newLabs);
      console.log(`Labs inserted successfully: ${insertedLabs.length}`);
    }
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedLabs();
