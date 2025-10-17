const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongoose").Types;
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary.config.js");

//Signup
async function signup(req, res) {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with that email or username already exists!" });
    }

    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starredRepositories: [],
    };
    const result = await User.create(newUser);

    const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, userId: result._id });
  } catch (error) {
    console.error("An Error occurred while signing up : ", error.message);
    res.status(500).send("Internal server error");
  }
}

//Login
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const Matched = await bcrypt.compare(password, user.password);
    if (!Matched) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error("An Error occurred while logging in : ", error.message);
    res.status(500).send("Internal server error");
  }
}

//Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(
      "An Error occurred while fetching all users : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Get user profile
async function getUserProfile(req, res) {
  const currentID = req.params.id;
  try {
    const user = await User.findById(currentID);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(user);
  } catch (error) {
    console.error(
      "An Error occurred while fetching user profile : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Update profile
async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;
  try {
    let updateField = { email };
    if (password) {
      const salt = await bcrypt.genSalt(7);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateField.password = hashedPassword;
    }

    const result = await User.findByIdAndUpdate(
      currentID,
      { $set: updateField },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(result);
  } catch (error) {
    console.error(
      "An Error occurred while updating user profile : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

async function updateUserProfilePicture(req, res) {
  const currentID = req.params.id;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "vercia_profile_pictures",
        transformation: [{ width: 250, height: 250, crop: "fill" }],
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).send("Error uploading to image server.");
        }

        const updatedUser = await User.findByIdAndUpdate(
          currentID,
          { $set: { profilePhoto: result.secure_url } },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found!" });
        }

        res.json(updatedUser);
      }
    );

    uploadStream.end(file.buffer);
  } catch (error) {
    console.error(
      "An Error occurred while updating user profile picture : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

//Delete profile
async function deleteUserProfile(req, res) {
  const currentID = req.params.id;
  try {
    const result = await User.deleteOne({ _id: new ObjectId(currentID) });

    if (result.deleteCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User profile deleted successfully" });
  } catch (error) {
    console.error(
      "An Error occurred while deleting user profile : ",
      error.message
    );
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  updateUserProfilePicture,
  deleteUserProfile,
};
