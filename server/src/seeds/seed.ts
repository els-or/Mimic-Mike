import db from '../config/connection.js';
// import { User, GameSession } from '../models/index.js';
import User from '../models/User.js';
import cleanDB from './cleanDB.js';

import userData from './userData.json' with { type: 'json'};

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    await User.create(userData);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
