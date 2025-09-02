import { Router } from 'express';
import { z } from 'zod';
import Podcast from '../models/Podcast';
import { validateRequest } from '../middlewares/validation';
import { authenticateAdmin } from '../middlewares/auth';
import { syncPodcasts } from '../services/spotify';
import { syncYouTubeVideos } from '../services/youtube';

const router = Router();

// Get all podcasts
router.get('/', async (req, res, next) => {
  try {
    const { platform, limit = 20, offset = 0 } = req.query;
    
    const query: any = {};
    if (platform) {
      query.platform = platform;
    }
    
    const podcasts = await Podcast.find(query)
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));
    
    const total = await Podcast.countDocuments(query);
    
    res.json({
      data: podcasts,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
});

// Get single podcast
router.get('/:id', async (req, res, next) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    
    if (!podcast) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Podcast not found',
        },
      });
    }
    
    res.json(podcast);
  } catch (error) {
    next(error);
  }
});

// Sync podcasts (admin only)
router.post('/sync', authenticateAdmin, async (req, res, next) => {
  try {
    const spotifyResult = await syncPodcasts();
    const youtubeResult = await syncYouTubeVideos();
    
    res.json({
      message: 'Sync completed',
      spotify: spotifyResult,
      youtube: youtubeResult,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
