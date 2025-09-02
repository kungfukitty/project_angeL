import axios from 'axios';
import { config } from '../config/env';
import Podcast from '../models/Podcast';

// These variables will store the access token and its expiration date
// so we don't have to fetch a new one for every request.
let accessToken: string | null = null;
let tokenExpiry: Date | null = null;

/**
 * Gets a Spotify API access token.
 * If a valid, unexpired token is already stored, it returns that token.
 * Otherwise, it requests a new one from the Spotify API.
 */
async function getSpotifyToken(): Promise<string> {
  // If we have a token and it's not expired, reuse it.
  if (accessToken && tokenExpiry && tokenExpiry > new Date()) {
    return accessToken;
  }

  // Otherwise, get a new token from the Spotify API.
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
  // Calculate the token's expiration date (it's given in seconds).
  tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);

  return accessToken;
}

/**
 * Syncs podcast episodes from a Spotify show with the database.
 * It fetches the latest 50 episodes and either creates new entries
 * or updates existing ones in the database.
 */
export async function syncPodcasts(): Promise<{ added: number; updated: number }> {
  try {
    const token = await getSpotifyToken();

    // The ID of the Spotify show to sync.
    // Replace this with your actual Spotify show ID.
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

    // Loop through each episode from the API response.
    for (const episode of response.data.items) {
      // Check if we already have this episode in our database.
      const existingPodcast = await Podcast.findOne({
        externalId: episode.id,
        platform: 'spotify',
      });

      if (existingPodcast) {
        // If it exists, update its details.
        existingPodcast.title = episode.name;
        existingPodcast.description = episode.description;
        existingPodcast.url = episode.external_urls.spotify;
        existingPodcast.thumbnailUrl = episode.images[0]?.url;
        existingPodcast.duration = episode.duration_ms;
        existingPodcast.publishedAt = new Date(episode.release_date);
        await existingPodcast.save();
        updated++;
      } else {
        // If it's a new episode, create a new entry in the database.
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
    // If something goes wrong, log the error and re-throw it.
    console.error('Spotify sync error:', error);
    throw error;
  }
}
