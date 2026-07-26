require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // assuming models/User.js exists and exports a mongoose model

async function testLogin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  
  const email = 'harrishn052@gmail.com';
  const password = 'Harrish123';
  const employeeId = 'MAIPRIME_SLM';
  
  const user = await User.findOne({
    email: new RegExp(`^${email}$`, 'i'),
    password: password,
    employeeId: new RegExp(`^${employeeId}$`, 'i')
  });
  
  console.log('Login result:', user ? 'SUCCESS' : 'FAILED');
  if (user) console.log('User found:', user.email, user.employeeId);
  
  process.exit(0);
}

testLogin().catch(console.error);
