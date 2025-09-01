import Metric from '../models/Metric';

export async function updateMetrics(): Promise<void> {
  try {
    // This would normally fetch from various APIs
    // For now, we'll just create sample metrics
    
    const metrics = [
      {
        platform: 'tiktok' as const,
        key: 'followers',
        value: Math.floor(Math.random() * 1000) + 15000,
      },
      {
        platform: 'instagram' as const,
        key: 'followers',
        value: Math.floor(Math.random() * 500) + 8000,
      },
      {
        platform: 'youtube' as const,
        key: 'subscribers',
        value: Math.floor(Math.random() * 200) + 3000,
      },
      {
        platform: 'spotify' as const,
        key: 'monthly_listeners',
        value: Math.floor(Math.random() * 100) + 1500,
      },
    ];
    
    await Metric.insertMany(
      metrics.map(m => ({
        ...m,
        timestamp: new Date(),
      }))
    );
  } catch (error) {
    console.error('Metrics update error:', error);
    throw error;
  }
}
