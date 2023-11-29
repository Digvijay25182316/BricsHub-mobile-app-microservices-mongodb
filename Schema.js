const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "please enter another email"],
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", schema);
