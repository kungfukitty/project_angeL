import axios from 'axios';
import { config } from '../config/env';
import Podcast from '../models/Podcast';

let accessToken: string | null = null;
let tokenExpiry: Date | null = null;

async function getSpotifyToken(): Promise<string> {
  if (accessToken && tokenExpiry && tokenExpiry > new Date()) {
    return accessToken;
  }
  
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
    }),
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${config.spotify.clientId}:${config.spotify.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  accessToken = response.data.access_token;
  tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
  
  return accessToken;
}

export async function syncPodcasts(): Promise<{ added: number; updated: number }> {
  try {
    const token = await getSpotifyToken();
    
    // Replace with your actual Spotify show ID
    const SHOW_ID = '6qJCwooq9fjtRvvJf7xVCs';
    
    const response = await axios.get(
      `https://api.spotify.com/v1/shows/${SHOW_ID}/episodes`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          limit: 50,
          market: 'US',
        },
      }
    );
    
    let added = 0;
    let updated = 0;
    
    for (const episode of response.data.items) {
      const existingPodcast = await Podcast.findOne({
        externalId: episode.id,
        platform: 'spotify',
      });
      
      if (existingPodcast) {
        existingPodcast.title = episode.name;
        existingPodcast.description = episode.description;
        existingPodcast.url = episode.external_urls.spotify;
        existingPodcast.thumbnailUrl = episode.images[0]?.url;
        existingPodcast.duration = episode.duration_ms;
        existingPodcast.publishedAt = new Date(episode.release_date);
        await existingPodcast.save();
        updated++;
      } else {
        await Podcast.create({
          externalId: episode.id,
          title: episode.name,
          description: episode.description,
          platform: 'spotify',
          url: episode.external_urls.spotify,
          thumbnailUrl: episode.images[0]?.url,
          duration: episode.duration_ms,
          publishedAt: new Date(episode.release_date),
        });
        added++;
      }
    }
    
    return { added, updated };
  } catch (error) {
    console.error('Spotify sync error:', error);
    throw error;
  }
}
