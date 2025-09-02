import { Router } from 'express';
import { z } from 'zod';
import Metric from '../models/Metric';
import User from '../models/User';
import Waitlist from '../models/Waitlist';
import Podcast from '../models/Podcast';
import { authenticateAdmin } from '../middlewares/auth';

const router = Router();

// Get summary metrics
router.get('/summary', async (req, res, next) => {
  try {
    // Get latest metrics for each platform
    // Include all platforms defined in the Metric model.  Previously the
    // `web` platform was omitted, which prevented web metrics from being
    // surfaced in the summary response even though the schema supports it.
    const platforms = ['tiktok', 'spotify', 'youtube', 'discord', 'instagram', 'threads', 'web'];
    const summary: Record<string, any> = {};
    
    for (const platform of platforms) {
      const latestMetrics = await Metric.find({ platform })
        .sort({ timestamp: -1 })
        .limit(10);
      
      if (latestMetrics.length > 0) {
        summary[platform] = latestMetrics.reduce((acc, metric) => {
          acc[metric.key] = metric.value;
          return acc;
        }, {} as Record<string, number>);
      }
    }
    
    // Add internal metrics
    summary.internal = {
      totalUsers: await User.countDocuments(),
      vipMembers: await User.countDocuments({ membershipTier: 'vip' }),
      waitlistCount: await Waitlist.countDocuments(),
      totalPodcasts: await Podcast.countDocuments(),
    };
    
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

// Get detailed metrics
router.get('/detailed', authenticateAdmin, async (req, res, next) => {
  try {
    const { platform, key, startDate, endDate } = req.query;
    
    const query: any = {};
    
    if (platform) {
      query.platform = platform;
    }
    
    if (key) {
      query.key = key;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate as string);
      }
    }
    
    const metrics = await Metric.find(query)
      .sort({ timestamp: -1 })
      .limit(1000);
    
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

// Ingest metrics (admin only)
const ingestSchema = z.object({
  body: z.object({
    metrics: z.array(z.object({
      // Accept all supported platforms when ingesting new metrics.  Adding
      // `'web'` here aligns the ingestion API with the Metric model and
      // prevents the API from rejecting valid web metrics.
      platform: z.enum(['tiktok', 'spotify', 'youtube', 'discord', 'instagram', 'threads', 'web']),
      key: z.string(),
      value: z.number(),
      metadata: z.record(z.any()).optional(),
    })),
  }),
});

router.post('/ingest', authenticateAdmin, validateRequest(ingestSchema), async (req, res, next) => {
  try {
    const { metrics } = req.body;
    
    const created = await Metric.insertMany(
      metrics.map(m => ({
        ...m,
        timestamp: new Date(),
      }))
    );
    
    res.json({
      message: 'Metrics ingested',
      count: created.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
