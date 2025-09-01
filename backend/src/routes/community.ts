mport { Router } from 'express';
import { z } from 'zod';
import { authenticate, authenticateAdmin } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { createDiscordInvite, assignDiscordRole } from '../services/discord';
import { sendTelegramBroadcast } from '../services/telegram';
import User from '../models/User';

const router = Router();

// Get Discord invite link
router.get('/discord/invite', authenticate, async (req, res, next) => {
  try {
    const inviteUrl = await createDiscordInvite();
    res.json({ url: inviteUrl });
  } catch (error) {
    next(error);
  }
});

// Link Discord account
const linkDiscordSchema = z.object({
  body: z.object({
    discordId: z.string(),
  }),
});

router.post('/discord/link', authenticate, validateRequest(linkDiscordSchema), async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { discordId } = req.body;
    
    // Check if Discord ID is already linked
    const existing = await User.findOne({ discordId });
    if (existing && existing._id.toString() !== userId) {
      return res.status(400).json({
        error: {
          code: 'ALREADY_LINKED',
          message: 'Discord account already linked to another user',
        },
      });
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { discordId },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }
    
    // Assign VIP role if applicable
    if (user.membershipTier === 'vip') {
      await assignDiscordRole(discordId);
    }
    
    res.json({
      message: 'Discord account linked successfully',
      discordId,
    });
  } catch (error) {
    next(error);
  }
});

// Send Telegram broadcast (admin only)
const broadcastSchema = z.object({
  body: z.object({
    message: z.string().min(1).max(4096),
    parseMode: z.enum(['HTML', 'Markdown']).optional(),
  }),
});

router.post('/telegram/broadcast', authenticateAdmin, validateRequest(broadcastSchema), async (req, res, next) => {
  try {
    const { message, parseMode } = req.body;
    
    const result = await sendTelegramBroadcast(message, parseMode);
    
    res.json({
      message: 'Broadcast sent',
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

// Get community stats
router.get('/stats', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const vipMembers = await User.countDocuments({ membershipTier: 'vip' });
    const discordLinked = await User.countDocuments({ discordId: { $exists: true } });
    
    res.json({
      totalUsers,
      vipMembers,
      discordLinked,
      engagement: {
        rate: vipMembers > 0 ? (vipMembers / totalUsers * 100).toFixed(2) + '%' : '0%',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
