const mongoosh = require("mongoose");

const connectDb = async () => {
  try {
    await mongoosh.connect(process.env.MONGODB_URI);
    console.log("databse connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
