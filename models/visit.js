// models/Visit.js
import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  visitedAt: { type: Date, default: Date.now },
  ip: String, // Optional: Store IP address for more detail
  userAgent: String, // Optional: Store user agent for more detail
});

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
