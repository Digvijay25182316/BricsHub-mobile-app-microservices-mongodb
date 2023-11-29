const mongoose = require("mongoose");

async function connectDB() {
  await mongoose
    .connect(
      "mongodb+srv://digvijayedake:Digvijay25182316@cluster0.dzeiuu7.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((data) => console.log("connected to cloude"))
    .catch((err) => console.log(err));
}
module.exports = connectDB;
