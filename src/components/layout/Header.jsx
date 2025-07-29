import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import arain1Logo from '../../assets/Arain (1).png';
import { 
  MenuOutlined, 
  CloseOutlined, 
  HomeOutlined, 
  ContactsOutlined, 
  UserOutlined, 
  DashboardOutlined,
  GlobalOutlined 
} from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { motion } from 'framer-motion';
import './Header.css';

const Header = ({ language, setLanguage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    {
      key: '/',
      label: t('home'),
      icon: <HomeOutlined />,
      path: '/'
    },
    {
      key: '/directory-registration',
      label: t('joinDirectory'),
      icon: <UserOutlined />,
      path: '/directory-registration'
    },
    {
      key: '/contact-us',
      label: t('contactUs'),
      icon: <ContactsOutlined />,
      path: '/contact-us'
    },
    {
      key: '/admin-dashboard',
      label: t('adminDashboard'),
      icon: <DashboardOutlined />,
      path: '/admin-dashboard'
    }
  ];

  // Language options
  const languageItems = {
    items: [
      {
        key: 'en',
        label: 'English',
        onClick: () => {
          setLanguage('en');
          i18n.changeLanguage('en');
        }
      },
      {
        key: 'ur',
        label: 'اردو',
        onClick: () => {
          setLanguage('ur');
          i18n.changeLanguage('ur');
        }
      }
    ]
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header 
      className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="header-content">
          {/* Logo Section */}
          <motion.div 
            className="logo-section"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <div className="logo-icon">
              <img 
                src={arain1Logo} 
                alt="Arain Association Logo" 
                width="40" 
                height="40" 
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div className="logo-text">
              <h3>Arain Association</h3>
              <span>Youth Wing Pakistan</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <motion.button
                key={item.key}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Language Selector & Mobile Menu Toggle */}
          <div className="header-actions">
            <Dropdown menu={languageItems} placement="bottomRight">
              <Button 
                type="text" 
                icon={<GlobalOutlined />}
                className="language-btn"
              >
                {i18n.language.toUpperCase()}
              </Button>
            </Dropdown>

            <Button
              type="text"
              icon={isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.nav 
          className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}
          initial={false}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="mobile-nav-content">
            {navItems.map((item) => (
              <motion.button
                key={item.key}
                className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.nav>
      </div>

    </motion.header>
  );
};

export default Header;
