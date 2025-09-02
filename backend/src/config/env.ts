import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8080'),
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  
  // Third-party APIs
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
  },
  discord: {
    botToken: process.env.DISCORD_BOT_TOKEN || '',
    guildId: process.env.DISCORD_GUILD_ID || '',
    vipRoleId: process.env.DISCORD_VIP_ROLE_ID || '',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    // Channel identifier for broadcasts.  Can be a channel username (prefixed
    // with @) or a chat ID.  Previously this value was hard-coded in
    // services/telegram.ts, making it impossible to configure at runtime.
    channelId: process.env.TELEGRAM_CHANNEL_ID || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    vipPriceId: process.env.STRIPE_VIP_PRICE_ID || '',
  },
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY || '',
    audienceId: process.env.MAILCHIMP_AUDIENCE_ID || '',
    server: process.env.MAILCHIMP_SERVER || 'us1',
  },
};
