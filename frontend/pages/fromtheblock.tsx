import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlayIcon, SpotifyIcon, YouTubeIcon } from '../components/Icons';
import Layout from '../components/Layout';
import { fetchPodcasts } from '../lib/api';

interface Podcast {
  _id: string;
  title: string;
  description?: string;
  platform: 'spotify' | 'youtube';
  url: string;
  thumbnailUrl?: string;
  publishedAt: string;
}

export default function FromTheBlock() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'spotify' | 'youtube'>('all');

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    try {
      const data = await fetchPodcasts();
      setPodcasts(data.data);
    } catch (error) {
      console.error('Failed to load podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPodcasts = filter === 'all' 
    ? podcasts 
    : podcasts.filter(p => p.platform === filter);

  return (
    <Layout>
      <Head>
        <title>From the Block to the Blockchain - Angel Kellogg</title>
        <meta name="description" content="Weekly crypto education and cultural commentary podcast" />
      </Head>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-display mb-6">
              From the Block to the Blockchain
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Breaking down crypto, DeFi, and Web3 culture for the community. 
              Real talk, no cap, just facts and alpha.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-full transition-all ${
                  filter === 'all' ? 'bg-primary-600 text-white' : 'glass-effect'
                }`}
              >
                All Episodes
              </button>
              <button
                onClick={() => setFilter('spotify')}
                className={`px-6 py-2 rounded-full transition-all ${
                  filter === 'spotify' ? 'bg-green-600 text-white' : 'glass-effect'
                }`}
              >
                <SpotifyIcon className="w-5 h-5 inline mr-2" />
                Spotify
              </button>
              <button
                onClick={() => setFilter('youtube')}
                className={`px-6 py-2 rounded-full transition-all ${
                  filter === 'youtube' ? 'bg-red-600 text-white' : 'glass-effect'
                }`}
              >
                <YouTubeIcon className="w-5 h-5 inline mr-2" />
                YouTube
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPodcasts.map((podcast, index) => (
                <motion.div
                  key={podcast._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="glass-effect rounded-xl overflow-hidden hover:scale-105 transition-transform"
                >
                  {podcast.thumbnailUrl && (
                    <div className="relative h-48 bg-dark-200">
                      <Image
                        src={podcast.thumbnailUrl}
                        alt={podcast.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {podcast.title}
                    </h3>
                    {podcast.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {podcast.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(podcast.publishedAt).toLocaleDateString()}
                      </span>
                      
                      <a
                        href={podcast.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-400 hover:text-primary-300"
                      >
                        <PlayIcon className="w-5 h-5 mr-1" />
                        Play
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
  
