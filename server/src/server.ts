import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import connectDatabase from './db';
import { errorMiddleware } from './middlewares/errorMiddleware';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import borrowRoutes from './routes/borrowRoutes';
import userRoutes from './routes/userRoutes';
import { notifyUsers } from './services/notifyUsers';
import { removeUnverifiedAccounts } from './services/removeUnverifiedAccounts';

// Load environment variables
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app: Express = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to Database
connectDatabase();

// Start Cron Jobs
notifyUsers();
removeUnverifiedAccounts();

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/book', bookRoutes);
app.use('/api/v1/borrow', borrowRoutes);
app.use('/api/v1/user', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
const PORT = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Library Management API ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

export default app;

