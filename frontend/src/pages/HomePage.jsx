import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiShieldCheck, HiLightningBolt, HiCheckCircle, HiChartBar } from 'react-icons/hi'

const HomePage = () => {
  const features = [
    {
      icon: <HiLightningBolt className="text-4xl text-accent-blue" />,
      title: 'Real-Time Detection',
      description: 'Liveness verdicts in under 50 ms. Fast enough to run inline with voice biometric matching without perceptible latency.'
    },
    {
      icon: <HiCheckCircle className="text-4xl text-accent-green" />,
      title: '98.4% Accuracy',
      description: 'Benchmark-leading detection across TTS, voice conversion, replay, and voice-cloning attacks. Calibrated with confidence scores, not just binary verdicts.'
    },
    {
      icon: <HiChartBar className="text-4xl text-purple-500" />,
      title: 'Advanced Analytics',
      description: 'Comprehensive feature analysis with attention heatmaps and spectral characteristics for detailed insights.'
    },
    {
      icon: <HiShieldCheck className="text-4xl text-yellow-500" />,
      title: 'Enterprise-grade',
      description: 'Purpose-built for voice and communication products with support for 80+ languages.'
    }
  ]
  
  const stats = [
    { value: '3.8M', label: 'Seconds of audio analyzed' },
    { value: '15.5%', label: 'Flagged as AI-generated' },
    { value: '98.4%', label: 'Accuracy' },
    { value: '80+', label: 'Languages supported' }
  ]
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Secure Every Voice
            <br />
            Interaction in the
            <br />
            <span className="gradient-text">Deepfake Era</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Add the <span className="text-accent-blue font-semibold">#1 deepfake detection</span> to your platform with a single API call.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link to="/detection" className="btn-primary">
              Start for Free
            </Link>
            <Link to="/docs" className="btn-secondary">
              View Documentation
            </Link>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-blue mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="bg-navy-800 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-accent-blue text-sm font-semibold mb-4 uppercase tracking-wide">
              Why SwarParikshan
            </p>
            <h2 className="text-5xl font-bold mb-6">
              Accuracy that <span className="text-accent-blue">stays ahead</span>
              <br />
              of the latest cloning tools
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              New voice cloning tools appear every week. Our models are continuously retrained against them so every call, every voice interaction on your platform is protected against threats that didn't exist last month.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-dark p-6 hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Technology Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent-blue text-sm font-semibold mb-4 uppercase tracking-wide">
            Technology
          </p>
          <h2 className="text-5xl font-bold mb-6">
            What Makes Our Detection
            <br />
            Different
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Purpose-built for voice and communication products.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: 'Real-Time Detection',
              description: 'Liveness verdicts in under 50 ms. Fast enough to run inline with voice biometric matching without perceptible latency.',
              color: 'text-accent-blue'
            },
            {
              title: '98%+ Accuracy',
              description: 'Benchmark-leading detection across TTS, voice conversion, replay, and voice-cloning attacks. Calibrated with confidence scores.',
              color: 'text-accent-green'
            },
            {
              title: '80+ Languages',
              description: 'Language-agnostic neural architecture that generalizes across accents, dialects, and telephony codecs.',
              color: 'text-purple-500'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-dark p-8"
            >
              <h3 className={`text-2xl font-bold mb-4 ${item.color}`}>
                {item.title}
              </h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Add Deepfake Detection to
            <br />
            Your Product
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Join the companies integrating industry-leading AI detection. Ship in days, not months.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/detection" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
              Request a Demo
            </Link>
            <Link to="/detection" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-lg transition-all duration-200">
              Start for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
