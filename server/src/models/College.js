const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true }); // keeps _id for each review

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  type: { type: String, enum: ["Government", "Private"], default: "Private" },
  courses: [{ name: { type: String, required: true } }],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  reviews: [reviewSchema],
  facilities: { type: [String], default: [] },
  admissionDates: { type: [Date], default: [] },
  __v: { type: Number, select: false } // optional, mirrors your data
});

// Create 2dsphere index for geospatial queries
collegeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("College", collegeSchema, "colleges");
