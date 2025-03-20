const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("🔄 Deleted old listings");
  initData.data = initData.data.map((obj)=>({
    ...obj,
    owner:"67c40bf6ef2a0c9df2bf0298"
  }));

  
  await Listing.insertMany(initData.data);
  console.log("✅ Data was inserted successfully");
  console.log("data was initialized");
};

initDB();