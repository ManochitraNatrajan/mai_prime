require('dotenv').config();
const mongoose = require('mongoose');

async function migrateData() {
  const oldUri = process.env.MONGO_URI;
  const newUri = oldUri.replace('kcn_attendance', 'maiprime_attendance');
  
  console.log('Connecting to old DB...');
  const oldConnection = await mongoose.createConnection(oldUri).asPromise();
  
  console.log('Connecting to new DB...');
  const newConnection = await mongoose.createConnection(newUri).asPromise();
  
  console.log('Fetching users and attendances from old DB...');
  const users = await oldConnection.db.collection('users').find({}).toArray();
  const attendances = await oldConnection.db.collection('attendances').find({}).toArray();
  
  console.log(`Found ${users.length} users and ${attendances.length} attendances.`);
  
  // Transform data
  const newUsers = users.map(u => {
    if (u.employeeId && u.employeeId.includes('KCN')) {
      u.employeeId = u.employeeId.replace('KCN', 'MAIPRIME');
    }
    return u;
  });
  
  const newAttendances = attendances.map(a => {
    if (a.employeeId && a.employeeId.includes('KCN')) {
      a.employeeId = a.employeeId.replace('KCN', 'MAIPRIME');
    }
    return a;
  });
  
  console.log('Inserting into new DB...');
  
  if (newUsers.length > 0) {
    // Clear first to avoid duplicates if run multiple times
    await newConnection.db.collection('users').deleteMany({});
    await newConnection.db.collection('users').insertMany(newUsers);
  }
  
  if (newAttendances.length > 0) {
    await newConnection.db.collection('attendances').deleteMany({});
    await newConnection.db.collection('attendances').insertMany(newAttendances);
  }
  
  console.log('Migration successful.');
  process.exit(0);
}

migrateData().catch(console.error);
