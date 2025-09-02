import { Telegraf } from 'telegraf';
import { config } from '../config/env';

const bot = new Telegraf(config.telegram.botToken);

export async function sendTelegramBroadcast(
  message: string,
  parseMode?: 'HTML' | 'Markdown'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Determine the channel ID from configuration.  Fallback to the
    // placeholder value when not provided.  A channel ID can be a
    // numeric chat ID or a public channel username prefixed with @.
    const CHANNEL_ID = config.telegram.channelId || '@your_channel';
    await bot.telegram.sendMessage(CHANNEL_ID, message, {
      parse_mode: parseMode,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Telegram broadcast error:', error);
    return { success: false, error: error?.message };
  }
}
