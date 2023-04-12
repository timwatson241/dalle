// Importing required dependencies
import express from 'express'; // Express web application framework
import * as dotenv from 'dotenv'; // Package to load environment variables from a .env file
import { Configuration, OpenAIApi } from 'openai'; // OpenAI API library for JavaScript

dotenv.config(); // Load environment variables from .env file

const router = express.Router(); // Creating a new router object from the express framework

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Setting the OpenAI API key from environment variables
});

const openai = new OpenAIApi(configuration); // Creating a new OpenAI API client with the given configuration

// Defining a route for GET requests to the root path
router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' }); // Sending a JSON response with a message
});

// Defining a route for POST requests to the root path
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body; // Extracting the 'prompt' property from the request body

    // Making a request to the OpenAI API to create an image based on the given prompt
    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    // Extracting the image data from the API response and sending it as a JSON response
    const image = aiResponse.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    // Sending an error response if there was a problem with the OpenAI API request
    console.error(error);
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

export default router; // Exporting the router object for use in other parts of the application
