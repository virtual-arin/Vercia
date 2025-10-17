import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResult = await cloudinary.uploader.upload(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  } finally {
    fs.unlinkSync(filePath);
  }
};

export default uploadOnCloudinary;