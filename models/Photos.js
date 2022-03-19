const mongoose = require("mongoose");

// Create Schema
const PhotoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  srcUrl: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: "",
  },
  votes: {
    type: Number,
    default: 0,
  },
});

module.exports = Photo = mongoose.model("photos", PhotoSchema);
