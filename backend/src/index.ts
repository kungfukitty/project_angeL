import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pino from 'pino';
import cron from 'node-cron';

// Import routes
import healthRouter from './routes/health';
import podcastRouter from './routes/podcast';
import waitlistRouter from './routes/waitlist';
import metricsRouter from './routes/metrics';
import paymentsRouter from './routes/payments';
import communityRouter from './routes/community';

// Import services
import { syncPodcasts } from './services/spotify';
import { syncYouTubeVideos } from './services/youtube';
import { updateMetrics } from './services/metrics';

// Import middleware
import { errorHandler } from './middlewares/errors';
import { requestLogger } from './middlewares/logger';

dotenv.config();

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

export const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI || '', {
  retryWrites: true,
  w: 'majority'
}).then(() => {
  logger.info('Connected to MongoDB Atlas');
}).catch((err) => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/podcast', podcastRouter);
app.use('/api/waitlist', waitlistRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/community', communityRouter);

// Error handling
app.use(errorHandler);

// Cron jobs
if (process.env.NODE_ENV === 'production') {
  // Sync podcasts every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Running podcast sync...');
    await syncPodcasts();
    await syncYouTubeVideos();
  });

  // Update metrics every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    logger.info('Updating metrics...');
    await updateMetrics();
  });
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
