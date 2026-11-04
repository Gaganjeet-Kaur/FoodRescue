require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const User = require('./models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

async function createAdmin() {
  try {
    const name = await ask('Admin name: ');
    const email = await ask('Admin email: ');
    const password = await ask('Admin password (minimum 6 characters): ');

    if (!name.trim() || !email.trim() || password.length < 6) {
      throw new Error('Please enter valid details. Password must be at least 6 characters.');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existing) {
      throw new Error('This email is already registered. Use a new email.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    });

    console.log('Admin account created successfully!');
  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
