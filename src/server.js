import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js'; // Adjust the path as necessary
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import job from './config/cron.js';

dotenv.config();

const app = express();

// If the environment is production, start the cron job to send GET requests every 14 minutes
if (process.env.NODE_ENV === 'prod') job.start();

// Middleware to apply rate limiting
app.use(rateLimiter);

// Middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get('/api/health', (req, res) => {
  res.send('Server is healthy and running!');
  res.status(200).json({ status: 'OK' });
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
