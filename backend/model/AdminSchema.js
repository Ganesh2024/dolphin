const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Admin schema
const AdminSchema = new Schema({ 
  email: { type: String, unique: true, sparse: true },
  password: { type: String , trim:true, required:true},
});

// User feedback Schema
const feedbackSchema = new Schema({
  email: { type: String },
  userFeedback: { type: String },
  date: { type: String },
});

const admin = mongoose.model("Admin", AdminSchema);
const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = {
  admin,
  Feedback,
};
