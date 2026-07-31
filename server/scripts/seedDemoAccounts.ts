import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../src/models/userModel';

dotenv.config({ path: path.join(process.cwd(), '../.env') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const demoAccounts = [
  {
    name: 'Demo User',
    email: 'demo.user@gotham-library.test',
    password: 'Demo123!',
    role: 'user' as const,
  },
  {
    name: 'Demo Admin',
    email: 'demo.admin@gotham-library.test',
    password: 'Demo123!',
    role: 'admin' as const,
  },
];

async function seedDemoAccounts() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/library';
  await mongoose.connect(mongoUri);

  for (const account of demoAccounts) {
    const hashedPassword = await bcrypt.hash(account.password, 10);

    await User.findOneAndUpdate(
      { email: account.email },
      {
        name: account.name,
        email: account.email,
        password: hashedPassword,
        role: account.role,
        accountVerified: true,
        verificationCode: undefined,
        verificationCodeExpire: undefined,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Seeded ${account.role}: ${account.email}`);
  }

  await mongoose.disconnect();
}

seedDemoAccounts().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
