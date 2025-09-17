const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: String,
  city: String,
  state: String,
  type: { type: String, enum: ["Government", "Private"], default: "Private" },
  courses: [{ name: String }],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  reviews: [{ rating: Number, text: String }]
});

collegeSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("College", collegeSchema);
