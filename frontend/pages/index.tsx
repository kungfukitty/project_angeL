import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon, VideoCameraIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import WaitlistForm from '../components/WaitlistForm';
import SocialLinks from '../components/SocialLinks';

export default function Home() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Angel Kellogg - From the Block to the Blockchain</title>
        <meta name="description" content="Crypto educator, developer, and trap-lux lifestyle architect building the future of Web3" />
        <meta property="og:title" content="Angel Kellogg - From the Block to the Blockchain" />
        <meta property="og:description" content="Crypto educator, developer, and trap-lux lifestyle architect" />
      </Head>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-purple-900/20" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 z-10"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-display mb-6"
            >
              ANGEL KELLOGG
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 gradient-text font-semibold"
            >
              From the Block to the Blockchain
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Crypto educator, developer, and trap-lux lifestyle architect. Building the bridge between 
              culture and technology through Web3 innovation, community empowerment, and unapologetic authenticity.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/fromtheblock" className="btn-primary inline-flex items-center justify-center">
                <MicrophoneIcon className="w-5 h-5 mr-2" />
                Listen to Podcast
              </Link>
              <button
                onClick={() => setShowWaitlist(true)}
                className="btn-secondary inline-flex items-center justify-center"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Join ForeverDocs Waitlist
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12"
            >
              <SocialLinks />
            </motion.div>
          </div>
        </motion.div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display mb-4">The Ecosystem</h2>
            <p className="text-xl text-gray-300">Building multiple revenue streams through attention</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MicrophoneIcon className="w-8 h-8" />,
                title: 'From the Block Podcast',
                description: 'Weekly crypto education and cultural commentary reaching thousands',
                link: '/fromtheblock',
              },
              {
                icon: <SparklesIcon className="w-8 h-8" />,
                title: 'ForeverDocs',
                description: 'Protecting Black generational wealth through blockchain technology',
                link: '/foreverdocs',
              },
              {
                icon: <VideoCameraIcon className="w-8 h-8" />,
                title: 'Content Empire',
                description: 'TikTok, YouTube, Instagram - viral content across all platforms',
                link: '/community',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Link href={feature.link}>
                  <div className="glass-effect p-8 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
                    <div className="text-primary-400 mb-4">{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display mb-4">
              Join the Movement
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get exclusive access to crypto alpha, community events, and early product launches
            </p>
            <Link href="/community" className="btn-primary inline-flex items-center">
              Enter the Community
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <WaitlistForm onClose={() => setShowWaitlist(false)} />
      )}
    </Layout>
  );
}
