const mongoose = require('mongoose');

module.exports = async function connectDB() {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to DB at: ${db.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
