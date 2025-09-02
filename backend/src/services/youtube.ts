import axios from 'axios';
import { config } from '../config/env';
import Podcast from '../models/Podcast';

export async function syncYouTubeVideos(): Promise<{ added: number; updated: number }> {
  try {
    // Replace with your actual YouTube channel ID
    const CHANNEL_ID = 'UCyejLaZWu0DPSsch4pbsfsg';
    
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          key: config.youtube.apiKey,
          channelId: CHANNEL_ID,
          part: 'snippet',
          order: 'date',
          maxResults: 50,
          type: 'video',
        },
      }
    );
    
    let added = 0;
    let updated = 0;
    
    for (const item of response.data.items) {
      const videoId = item.id.videoId;
      
      const existingPodcast = await Podcast.findOne({
        externalId: videoId,
        platform: 'youtube',
      });
      
      if (existingPodcast) {
        existingPodcast.title = item.snippet.title;
        existingPodcast.description = item.snippet.description;
        existingPodcast.url = `https://www.youtube.com/watch?v=${videoId}`;
        existingPodcast.thumbnailUrl = item.snippet.thumbnails.high.url;
        existingPodcast.publishedAt = new Date(item.snippet.publishedAt);
        await existingPodcast.save();
        updated++;
      } else {
        await Podcast.create({
          externalId: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          platform: 'youtube',
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          publishedAt: new Date(item.snippet.publishedAt),
        });
        added++;
      }
    }
    
    return { added, updated };
  } catch (error) {
    console.error('YouTube sync error:', error);
    throw error;
  }
}
