import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '../config/env';

let client: Client | null = null;

async function getDiscordClient(): Promise<Client> {
  if (client && client.isReady()) {
    return client;
  }
  
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
    ],
  });
  
  await client.login(config.discord.botToken);
  
  return new Promise((resolve) => {
    client!.once('ready', () => {
      console.log('Discord bot ready');
      resolve(client!);
    });
  });
}

export async function createDiscordInvite(): Promise<string> {
  try {
    const discordClient = await getDiscordClient();
    const guild = await discordClient.guilds.fetch(config.discord.guildId);
    const channel = guild.channels.cache.find(ch => ch.isTextBased());
    
    if (!channel || !channel.isTextBased()) {
      throw new Error('No text channel found');
    }
    
    const invite = await channel.createInvite({
      maxAge: 86400, // 24 hours
      maxUses: 1,
    });
    
    return invite.url;
  } catch (error) {
    console.error('Discord invite error:', error);
    throw error;
  }
}

export async function assignDiscordRole(discordId: string): Promise<void> {
  try {
    const discordClient = await getDiscordClient();
    const guild = await discordClient.guilds.fetch(config.discord.guildId);
    const member = await guild.members.fetch(discordId);
    
    await member.roles.add(config.discord.vipRoleId);
  } catch (error) {
    console.error('Discord role assignment error:', error);
    throw error;
  }
}

export async function removeDiscordRole(discordId: string): Promise<void> {
  try {
    const discordClient = await getDiscordClient();
    const guild = await discordClient.guilds.fetch(config.discord.guildId);
    const member = await guild.members.fetch(discordId);
    
    await member.roles.remove(config.discord.vipRoleId);
  } catch (error) {
    console.error('Discord role removal error:', error);
    throw error;
  }
}
