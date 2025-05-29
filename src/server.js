import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js'; // Adjust the path as necessary
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();

// Middleware to apply rate limiting
app.use(rateLimiter);

// Middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get('/health', (req, res) => {
  res.send('Server is healthy and running!');
});

app.use('/api/transactions', transactionsRoute);

// Start the server and initialize the database
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start the server', error);
    process.exit(1); // Exit the process with failure status
  });
