import React from 'react'
import { Link } from 'react-router-dom'
import { 
  HiShieldCheck, 
  HiMail, 
  HiPhone, 
  HiLocationMarker,
  HiExternalLink
} from 'react-icons/hi'
import { 
  FaLinkedin, 
  FaTwitter, 
  FaGithub, 
  FaYoutube,
  FaFacebook,
  FaInstagram
} from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Get Started',
      links: [
        { label: 'Pricing', to: '/pricing' },
        { label: 'Free Trial Guide', to: '/trial' },
        { label: 'Trial Center', to: '/trial-center' },
        { label: 'Falcon Flex', to: '/falcon-flex' },
        { label: 'Financing', to: '/financing' },
        { label: 'Marketplace', to: '/marketplace' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Executive Leadership', to: '/leadership' },
        { label: 'Board of Directors', to: '/board' },
        { label: 'Newsroom', to: '/news' },
        { label: 'Investor Relations', to: '/investors', external: true },
        { label: 'Careers', to: '/careers' },
        { label: 'Sustainability', to: '/sustainability' }
      ]
    },
    {
      title: 'Partners',
      links: [
        { label: 'Partner Programs', to: '/partners' },
        { label: 'Service Providers', to: '/service-providers' },
        { label: 'Strategic Technology', to: '/strategic-tech' },
        { label: 'Channel & Distributors', to: '/distributors' },
        { label: 'Partner Locator', to: '/partner-locator' },
        { label: 'Become a Partner', to: '/become-partner' },
        { label: 'Project QuiltWorks', to: '/quiltworks' }
      ]
    },
    {
      title: 'Products',
      links: [
        { label: 'Audio Detection', to: '/detection' },
        { label: 'Image Detection', to: '/image-detection' },
        { label: 'API Access', to: '/api-keys' },
        { label: 'Batch Processing', to: '/batch' },
        { label: 'Webhooks', to: '/webhooks' },
        { label: 'SDK & Libraries', to: '/sdk' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', to: '/docs' },
        { label: 'API Reference', to: '/api-reference' },
        { label: 'Blog', to: '/blog' },
        { label: 'Case Studies', to: '/case-studies' },
        { label: 'White Papers', to: '/whitepapers' },
        { label: 'Research Papers', to: '/research' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Support Portal', to: '/support', external: true },
        { label: 'Developer Portal', to: '/developer-portal', external: true },
        { label: 'Community', to: '/community', external: true },
        { label: 'Contact Us', to: '/contact' },
        { label: 'FAQs', to: '/faqs' },
        { label: 'Status Page', to: '/status', external: true },
        { label: 'Report Issue', to: '/report' }
      ]
    }
  ]

  return (
    <footer className="bg-navy-900 border-t border-navy-700 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-accent-blue text-sm transition-colors flex items-center space-x-1"
                      >
                        <span>{link.label}</span>
                        <HiExternalLink className="text-xs" />
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-gray-400 hover:text-accent-blue text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-navy-700 mb-8"></div>

        {/* Brand and Contact Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <HiShieldCheck className="text-accent-blue text-3xl" />
              <span className="text-2xl font-bold gradient-text">
                SwarParikshan
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Enterprise-grade multimedia AI detection platform. Detect audio deepfakes and AI-generated images with industry-leading accuracy.
            </p>
            <p className="text-gray-500 text-xs">
              Specialized for Indo-Aryan languages 🇮🇳
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              Contact Information
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3 text-gray-400">
                <HiMail className="text-accent-blue mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <a href="mailto:support@swarparikshan.com" className="hover:text-accent-blue transition-colors">
                    support@swarparikshan.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <HiPhone className="text-accent-blue mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <a href="tel:+18885525900" className="hover:text-accent-blue transition-colors">
                    Call 1-888-552-5900 (US)
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <HiLocationMarker className="text-accent-blue mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Location</p>
                  <p>Mumbai, Maharashtra, India</p>
                  <p>San Francisco, CA, USA</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for updates, tips, and exclusive offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors text-sm"
              />
              <button
                type="submit"
                className="w-full bg-accent-blue hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent-blue transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-2xl" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent-blue transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter className="text-2xl" />
          </a>
          <a
            href="https://github.com/tanuj-cmd-15/multimedia-ai-detection-"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent-blue transition-colors"
            aria-label="GitHub"
          >
            <FaGithub className="text-2xl" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent-blue transition-colors"
            aria-label="YouTube"
          >
            <FaYoutube className="text-2xl" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent-blue transition-colors"
            aria-label="Facebook"
          >
            <FaFacebook className="text-2xl" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent-blue transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram className="text-2xl" />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-navy-700 mb-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <p>Copyright © {currentYear} SwarParikshan</p>
            <Link to="/privacy" className="hover:text-accent-blue transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-accent-blue transition-colors">
              Cookies
            </Link>
            <Link to="/privacy-choices" className="hover:text-accent-blue transition-colors flex items-center space-x-1">
              <span>Your Privacy Choices</span>
              <span className="text-accent-blue">🔵</span>
            </Link>
            <Link to="/terms" className="hover:text-accent-blue transition-colors">
              Terms of Use
            </Link>
            <Link to="/accessibility" className="hover:text-accent-blue transition-colors">
              Accessibility
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">🌐</span>
            <select className="bg-navy-800 border border-navy-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-accent-blue">
              <option>English (US)</option>
              <option>हिन्दी (Hindi)</option>
              <option>मराठी (Marathi)</option>
              <option>বাংলা (Bengali)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-navy-800 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-xs">
            <div className="flex items-center space-x-2">
              <HiShieldCheck className="text-green-400" />
              <span>SOC 2 Type II Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiShieldCheck className="text-green-400" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiShieldCheck className="text-green-400" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiShieldCheck className="text-green-400" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiShieldCheck className="text-green-400" />
              <span>99.9% Uptime SLA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
