const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  repositories: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository",
      },
    ],
    default: [],
  },
  followedUsers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  starredRepositories: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repository" }],
    default: [],
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
