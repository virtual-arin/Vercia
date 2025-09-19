const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/allUsers", userController.getAllUsers);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.put(
  "/updateProfilePicture/:id",
  upload.single("profilePicture"),
  userController.updateUserProfilePicture
);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);

module.exports = userRouter;
