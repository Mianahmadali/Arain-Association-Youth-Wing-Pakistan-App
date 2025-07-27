import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import DirectoryRegistration from './pages/DirectoryRegistration';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import { Layout, Menu, Switch } from 'antd';
import { UserOutlined, FormOutlined, DashboardOutlined, PhoneOutlined } from '@ant-design/icons';
import ChatbotWidget from './components/ChatbotWidget';

const { Header, Content, Footer } = Layout;

function App() {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = React.useState('en');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ur' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header className="navbar-custom" style={{ position: 'fixed', zIndex: 1000, width: '100%' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="logo" style={{ 
                marginRight: '2rem',
                fontWeight: 'bold',
                color: '#003366',
                fontSize: '1.2rem'
              }}>
                Arain Association
              </div>
              <Menu 
                mode="horizontal" 
                defaultSelectedKeys={['home']} 
                style={{ border: 'none', background: 'transparent' }}
                items={[
                  {
                    key: 'home',
                    icon: <UserOutlined />,
                    label: <Link to="/">{t('home')}</Link>
                  },
                  {
                    key: 'directory',
                    icon: <FormOutlined />,
                    label: <Link to="/directory-registration">{t('joinDirectory')}</Link>
                  },
                  {
                    key: 'contact',
                    icon: <PhoneOutlined />,
                    label: <Link to="/contact-us">{t('contactUs')}</Link>
                  },
                  {
                    key: 'dashboard',
                    icon: <DashboardOutlined />,
                    label: <Link to="/admin-dashboard">{t('dashboard')}</Link>
                  }
                ]}
              />
            </div>
            <Switch 
              checkedChildren="اردو" 
              unCheckedChildren="EN" 
              checked={language === 'ur'} 
              onChange={toggleLanguage} 
            />
          </div>
        </Header>
        <Content style={{ marginTop: 64 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/directory-registration" element={<DirectoryRegistration />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </Content>
        <Footer className="footer-custom text-center">
          <div className="container">
            <p className="mb-2">{t('missionStatement')}</p>
            <p className="mb-0">
              Email: info@arainyouthwing.org | Phone: +92 300 1234567
              <br />
              Follow us on social media
            </p>
          </div>
        </Footer>
        <ChatbotWidget language={language} />
      </Layout>
    </Router>
  );
}

export default App;

