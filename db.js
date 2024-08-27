const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
