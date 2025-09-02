import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, DocumentIcon, LockClosedIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import WaitlistForm from '../components/WaitlistForm';

export default function ForeverDocs() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <Layout>
      <Head>
        <title>ForeverDocs - Protecting Black Generational Wealth</title>
        <meta name="description" content="Blockchain-powered document protection for generational wealth preservation" />
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
            <h1 className="text-5xl md:text-7xl font-display mb-6 gradient-text">
              ForeverDocs
            </h1>
            <p className="text-2xl text-gray-300 mb-8">
              Protecting Black Generational Wealth Through Blockchain
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Secure your family's most important documents on the blockchain. 
              Wills, deeds, insurance policies - preserved forever, accessible always.
            </p>
            
            <button
              onClick={() => setShowWaitlist(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              Join the Waitlist
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShieldCheckIcon className="w-12 h-12" />,
                title: 'Blockchain Security',
                description: 'Documents protected by immutable blockchain technology',
              },
              {
                icon: <DocumentIcon className="w-12 h-12" />,
                title: 'Easy Access',
                description: 'Access your documents anywhere, anytime, forever',
              },
              {
                icon: <LockClosedIcon className="w-12 h-12" />,
                title: 'Private & Encrypted',
                description: 'Military-grade encryption keeps your data safe',
              },
              {
                icon: <CurrencyDollarIcon className="w-12 h-12" />,
                title: 'Wealth Protection',
                description: 'Ensure your legacy passes to the next generation',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-primary-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display mb-6">The Problem</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  70% of wealthy families lose their wealth by the second generation
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Important documents get lost, damaged, or destroyed
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Legal battles over unclear documentation
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  No secure way to pass down digital assets
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display mb-6">The Solution</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Permanent blockchain storage that can't be lost or destroyed
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Smart contracts for automatic inheritance distribution
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Time-locked access for beneficiaries
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Complete audit trail for legal protection
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display mb-4">
              Be Part of the Revolution
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the waitlist and be first to protect your family's future
            </p>
            <button
              onClick={() => setShowWaitlist(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              Secure Your Spot
            </button>
          </motion.div>
        </div>
      </section>

      {showWaitlist && (
        <WaitlistForm source="foreverdocs" onClose={() => setShowWaitlist(false)} />
      )}
    </Layout>
  );
}
