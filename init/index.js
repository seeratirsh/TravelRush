const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require ("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/travelrush";

main()
.then(() => {
  console.log("connected to mongo DB");
})
.catch(err => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '69e60d1090c43eed013f621f'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
