const mongoose = require("mongoose");

async function DB_Connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database");
  } catch (err) {
    console.log("did not connect to database");
    console.log(err);
  }
}

module.exports = DB_Connect;
