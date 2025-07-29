import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  HeartFilled
} from '@ant-design/icons';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import arain1Logo from '../../assets/Arain (1).png';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: t('home'), path: '/' },
    { label: t('contactUs'), path: '/contact-us' },
    { label: t('joinDirectory'), path: '/directory-registration' },
    { label: t('adminDashboard'), path: '/admin-dashboard' }
  ];

  const services = [
    { label: t('education'), description: 'Educational scholarships and programs' },
    { label: t('healthcare'), description: 'Free medical camps and services' },
    { label: t('welfare'), description: 'Community development projects' },
    { label: t('donate'), description: 'Support our cause' }
  ];

  const socialLinks = [
    { 
      icon: <FacebookOutlined />, 
      name: 'Facebook', 
      url: '#',
      color: '#1877F2'
    },
    { 
      icon: <TwitterOutlined />, 
      name: 'Twitter', 
      url: '#',
      color: '#1DA1F2'
    },
    { 
      icon: <InstagramOutlined />, 
      name: 'Instagram', 
      url: '#',
      color: '#E4405F'
    },
    { 
      icon: <LinkedinOutlined />, 
      name: 'LinkedIn', 
      url: '#',
      color: '#0A66C2'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialClick = (url) => {
    if (url !== '#') {
      window.open(url, '_blank');
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-main">
        <div className="container">
          <Row gutter={[32, 32]}>
            {/* Organization Info */}
            <Col xs={24} sm={12} lg={6}>
              <motion.div 
                className="footer-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="footer-logo">
                  <img src={arain1Logo} alt="Arain Association Logo" width="50" height="50" 
                    style={{
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: '5px',
                      objectFit: 'contain'
                    }} />
                  <div className="footer-logo-text">
                    <h3>Arain Association</h3>
                    <span>Youth Wing Pakistan</span>
                  </div>
                </div>
                <p className="footer-description">
                  Empowering communities through education, healthcare, and welfare initiatives. 
                  Together, we build a stronger Pakistan for future generations.
                </p>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <motion.button
                      key={index}
                      className="social-btn"
                      style={{ '--social-color': social.color }}
                      onClick={() => handleSocialClick(social.url)}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </Col>

            {/* Quick Links */}
            <Col xs={24} sm={12} lg={6}>
              <motion.div 
                className="footer-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="footer-title">Quick Links</h4>
                <ul className="footer-links">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <motion.button
                        className="footer-link"
                        onClick={() => handleNavigation(link.path)}
                        whileHover={{ x: 5 }}
                      >
                        {link.label}
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Col>

            {/* Services */}
            <Col xs={24} sm={12} lg={6}>
              <motion.div 
                className="footer-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="footer-title">Our Services</h4>
                <ul className="footer-services">
                  {services.map((service, index) => (
                    <li key={index} className="service-item">
                      <h5>{service.label}</h5>
                      <p>{service.description}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Col>

            {/* Contact Info */}
            <Col xs={24} sm={12} lg={6}>
              <motion.div 
                className="footer-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="footer-title">Contact Us</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <EnvironmentOutlined className="contact-icon" />
                    <div>
                      <p>Main Office, Lahore</p>
                      <p>Punjab, Pakistan</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <PhoneOutlined className="contact-icon" />
                    <div>
                      <p>+92 300 1234567</p>
                      <p>+92 301 7654321</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <MailOutlined className="contact-icon" />
                    <div>
                      <p>info@arainyouthwing.org</p>
                      <p>contact@arainyouthwing.org</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <Row align="middle" justify="space-between">
            <Col xs={24} md={12}>
              <p className="copyright">
                © {currentYear} Arain Association Youth Wing Pakistan. All rights reserved.
              </p>
            </Col>
            <Col xs={24} md={12}>
              <p className="made-with-love">
                Made with <HeartFilled className="heart-icon" /> for the community
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
