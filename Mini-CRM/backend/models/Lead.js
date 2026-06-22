const mongoose = require("mongoose");

// This schema defines how lead documents are stored in MongoDB.
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    source: {
      type: String,
      enum: ["Website", "LinkedIn", "Referral", "Facebook","Forms","Other"],
      default: "Website",
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted"],
      default: "New",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes help MongoDB find owner records and searchable fields faster.
leadSchema.index({ createdBy: 1, createdAt: -1 });
leadSchema.index({ name: "text", email: "text", company: "text" });

module.exports = mongoose.model("Lead", leadSchema);   
