require('dotenv').config();
const mongoose = require('mongoose');

async function checkData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  const collections = Object.keys(mongoose.connection.collections);
  console.log('Collections:', collections);
  
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();
  const attendances = await db.collection('attendances').find({}).toArray();
  
  console.log(`Found ${users.length} users and ${attendances.length} attendances.`);
  
  const kcnUsers = users.filter(u => u.employeeId && u.employeeId.toLowerCase().includes('kcn'));
  console.log(`Users with KCN in employeeId: ${kcnUsers.length}`);
  if (kcnUsers.length > 0) {
    console.log('Example KCN user:', kcnUsers[0].employeeId);
  }
  
  process.exit(0);
}

checkData().catch(console.error);
