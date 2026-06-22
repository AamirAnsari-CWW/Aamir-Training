const { text } = require("express");
const mongoose = require("mongoose");

// This schema defines how customer documents are stored in MongoDB.
const customerSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
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
customerSchema.index({ createdBy: 1, createdAt: -1 });
customerSchema.index({ name: "text", email: "text", company: "text" });

module.exports = mongoose.model("Customer", customerSchema);
