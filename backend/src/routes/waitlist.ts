import { Router } from 'express';
import { z } from 'zod';
import Waitlist from '../models/Waitlist';
import { validateRequest } from '../middlewares/validation';
import { authenticateAdmin } from '../middlewares/auth';
import { addToMailchimp } from '../services/mailchimp';

const router = Router();

const waitlistSchema = z.object({
  body: z.object({
    email: z.string().email(),
    source: z.enum(['foreverdocs', 'general']).optional(),
    referrer: z.string().optional(),
  }),
});

// Join waitlist
router.post('/', validateRequest(waitlistSchema), async (req, res, next) => {
  try {
    const { email, source = 'general', referrer } = req.body;
    
    // Check if already exists
    const existing = await Waitlist.findOne({ email });
    if (existing) {
      return res.status(400).json({
        error: {
          code: 'ALREADY_EXISTS',
          message: 'Email already on waitlist',
        },
      });
    }
    
    // Add to database
    const entry = new Waitlist({
      email,
      source,
      referrer,
    });
    
    await entry.save();
    
    // Add to Mailchimp
    try {
      await addToMailchimp(email, { source, referrer });
    } catch (mailchimpError) {
      console.error('Mailchimp error:', mailchimpError);
      // Don't fail the request if Mailchimp fails
    }
    
    res.status(201).json({
      message: 'Successfully joined waitlist',
      position: await Waitlist.countDocuments(),
    });
  } catch (error) {
    next(error);
  }
});

// Get waitlist count (admin only)
router.get('/count', authenticateAdmin, async (req, res, next) => {
  try {
    const total = await Waitlist.countDocuments();
    const bySource = await Waitlist.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
    ]);
    
    res.json({
      total,
      bySource: bySource.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    next(error);
  }
});

// Get waitlist entries (admin only)
router.get('/', authenticateAdmin, async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const entries = await Waitlist.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));
    
    const total = await Waitlist.countDocuments();
    
    res.json({
      data: entries,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
