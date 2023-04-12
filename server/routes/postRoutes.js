// Importing required dependencies
import express from 'express'; // Express web framework
import * as dotenv from 'dotenv'; // dotenv for loading environment variables
import { v2 as cloudinary } from 'cloudinary'; // cloudinary for image and video management
import Post from '../mongodb/models/post.js'; // Importing a Post model from a MongoDB database

// Load environment variables from a .env file
dotenv.config();

// Create an instance of the Express router
const router = express.Router();

// Configure the cloudinary module with API key, API secret, and cloud name
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
});

// Handle GET requests to the root route
router.route('/').get(async (req, res) => {
  try {
    // Fetch all posts from the MongoDB database using the Post model
    const posts = await Post.find({});

    // Return a JSON response with the fetched posts and a success status code
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    // If an error occurs, return a JSON response with a failure status code and an error message
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

// Handle POST requests to the root route
router.route('/').post(async (req, res) => {
  try {
    // Extract the name, prompt, and photo fields from the request body
    const { name, prompt, photo } = req.body;

    // Upload the photo to Cloudinary and get the URL of the uploaded photo
    const photoUrl = await cloudinary.uploader.upload(photo);

    // Create a new post in the MongoDB database using the Post model and the extracted fields and photo URL
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    // Return a JSON response with the newly created post and a success status code
    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    // If an error occurs, return a JSON response with a failure status code and an error message
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
});

// Export the Express router for use in other parts of the application
export default router;
