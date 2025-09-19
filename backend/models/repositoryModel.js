const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  content: [
    {
      type: String,
    },
  ],
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
});

module.exports = mongoose.model("Repository", repositorySchema);
