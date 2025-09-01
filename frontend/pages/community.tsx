import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import SocialLinks from '../components/SocialLinks';

export default function Community() {
  return (
    <Layout>
      <Head>
        <title>Community - Angel Kellogg</title>
        <meta name="description" content="Join the Angel Kellogg community across all platforms" />
      </Head>

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-display mb-6">
              Join the Movement
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Connect with Angel Kellogg across all platforms
            </p>
            
            <div className="mb-16">
              <SocialLinks size="large" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="glass-effect p-8 rounded-2xl"
              >
                <h3 className="text-2xl font-bold mb-4">Discord Community</h3>
                <p className="text-gray-300 mb-6">
                  Exclusive alpha, live sessions, and VIP access to the inner circle
                </p>
                <a
                  href="https://discord.gg/angelkellogg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block"
                >
                  Join Discord
                </a>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="glass-effect p-8 rounded-2xl"
              >
                <h3 className="text-2xl font-bold mb-4">Telegram Channel</h3>
                <p className="text-gray-300 mb-6">
                  Daily crypto updates, market analysis, and community discussions
                </p>
                <a
                  href="https://t.me/angelkellogg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block"
                >
                  Join Telegram
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
