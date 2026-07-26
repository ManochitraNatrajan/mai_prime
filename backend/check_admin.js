require('dotenv').config();
const mongoose = require('mongoose');

async function checkAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  const user = await mongoose.connection.db.collection('users').findOne({ email: 'harrishn052@gmail.com' });
  console.log('Admin user in DB:', user);
  process.exit(0);
}

checkAdmin().catch(console.error);
