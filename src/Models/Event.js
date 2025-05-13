const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: Date,
  time: String,
  location: String,
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approved: { type: Boolean, default: false }, // Admin will approve
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
