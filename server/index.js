// Import required modules
import express from 'express'; // Express.js is a popular web framework for Node.js
import * as dotenv from 'dotenv'; // dotenv allows us to use environment variables
import cors from 'cors'; // CORS is a package that allows cross-origin resource sharing

// Import custom modules
import connectDB from './mongodb/connect.js'; // This module connects to the MongoDB database
import postRoutes from './routes/postRoutes.js'; // These modules define the routes for posts
import dalleRoutes from './routes/dalleRoutes.js'; // These modules define the routes for DALL-E requests

// Load environment variables from a .env file (if present)
dotenv.config();

// Create a new Express application
const app = express();

// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());

// Enable parsing of JSON data with a limit of 50 MB
app.use(express.json({ limit: '50mb' }));

// Register the routes for posts and DALL-E requests
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

// Define a simple route that returns a JSON response
app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from DALL-E!',
  });
});

// Define an asynchronous function to start the server
const startServer = async () => {
  try {
    // Connect to the MongoDB database using the URL specified in the environment variables
    connectDB(process.env.MONGODB_URL);
    // Start the server on port 8080
    app.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    // Log any errors that occur during server startup
    console.log(error);
  }
};

// Start the server by calling the startServer function
startServer();
