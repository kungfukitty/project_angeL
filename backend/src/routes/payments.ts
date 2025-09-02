import { Router } from 'express';
import express from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import User from '../models/User';
import Membership from '../models/Membership';
import { config } from '../config/env';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { assignDiscordRole, removeDiscordRole } from '../services/discord';

const router = Router();
const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
});

// Create checkout session
const checkoutSchema = z.object({
  body: z.object({
    priceId: z.string(),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
  }),
});

router.post('/create-checkout-session', authenticate, validateRequest(checkoutSchema), async (req, res, next) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    const userId = (req as any).user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }
    
    // Check for existing membership
    const existingMembership = await Membership.findOne({
      userId: user._id,
      status: 'active',
    });
    
    if (existingMembership) {
      return res.status(400).json({
        error: {
          code: 'ALREADY_SUBSCRIBED',
          message: 'User already has an active membership',
        },
      });
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
      },
    });
    
    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    next(error);
  }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        
        if (userId) {
          // Create membership record
          const membership = new Membership({
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            tier: 'vip',
            status: 'active',
          });
          
          await membership.save();
          
          // Update user tier
          await User.findByIdAndUpdate(userId, {
            membershipTier: 'vip',
          });
          
          // Assign Discord role if user has Discord ID
          const user = await User.findById(userId);
          if (user?.discordId) {
            await assignDiscordRole(user.discordId);
          }
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const membership = await Membership.findOne({
          stripeSubscriptionId: subscription.id,
        });
        
        if (membership) {
          membership.status = subscription.status as any;
          membership.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          membership.cancelAtPeriodEnd = subscription.cancel_at_period_end;
          await membership.save();
          
          // Update user tier based on status
          const user = await User.findById(membership.userId);
          if (user) {
            if (subscription.status === 'active') {
              user.membershipTier = 'vip';
              if (user.discordId) {
                await assignDiscordRole(user.discordId);
              }
            } else {
              user.membershipTier = 'free';
              if (user.discordId) {
                await removeDiscordRole(user.discordId);
              }
            }
            await user.save();
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const membership = await Membership.findOne({
          stripeSubscriptionId: subscription.id,
        });
        
        if (membership) {
          membership.status = 'canceled';
          await membership.save();
          
          // Update user tier
          const user = await User.findById(membership.userId);
          if (user) {
            user.membershipTier = 'free';
            await user.save();
            
            if (user.discordId) {
              await removeDiscordRole(user.discordId);
            }
          }
        }
        break;
      }
    }
    
    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    res.status(500).send(`Webhook handler failed: ${err.message}`);
  }
});

// Get customer portal URL
router.post('/portal', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    
    const membership = await Membership.findOne({
      userId,
      status: 'active',
    });
    
    if (!membership || !membership.stripeCustomerId) {
      return res.status(404).json({
        error: {
          code: 'NO_MEMBERSHIP',
          message: 'No active membership found',
        },
      });
    }
    
    const session = await stripe.billingPortal.sessions.create({
      customer: membership.stripeCustomerId,
      return_url: `${config.frontendOrigin}/account`,
    });
    
    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
});

export default router;
