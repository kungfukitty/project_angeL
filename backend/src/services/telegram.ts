import { Telegraf } from 'telegraf';
import { config } from '../config/env';

const bot = new Telegraf(config.telegram.botToken);

export async function sendTelegramBroadcast(
  message: string,
  parseMode?: 'HTML' | 'Markdown'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Replace with your actual Telegram channel ID
    const CHANNEL_ID = '@your_channel';
    
    await bot.telegram.sendMessage(CHANNEL_ID, message, {
      parse_mode: parseMode,
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Telegram broadcast error:', error);
    return { success: false, error: error.message };
  }
}
