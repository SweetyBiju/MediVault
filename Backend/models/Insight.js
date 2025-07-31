// models/Insight.js
import mongoose from "mongoose";

const parameterSchema = new mongoose.Schema({
  name: String,
  value: String,
  range: String,
  meaning: String,
  status: String,
  organ: String,
});

const insightSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true },
    reportId: { type: String, required: true },
    summary: { type: String, required: true },
    parameters: [parameterSchema],
    recommendations: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Insight", insightSchema);
