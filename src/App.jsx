import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import DirectoryRegistration from './pages/DirectoryRegistration';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import { Layout } from 'antd';
import ChatbotWidget from './components/ChatbotWidget';

const { Content } = Layout;

function App() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = React.useState('en');

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Content>
          <Routes>
            <Route path="/" element={<HomePage language={language} setLanguage={setLanguage} />} />
            <Route path="/directory-registration" element={<DirectoryRegistration language={language} setLanguage={setLanguage} />} />
            <Route path="/contact-us" element={<ContactUs language={language} setLanguage={setLanguage} />} />
            <Route path="/admin-dashboard" element={<AdminDashboard language={language} setLanguage={setLanguage} />} />
          </Routes>
        </Content>
        <ChatbotWidget language={language} />
      </Layout>
    </Router>
  );
}

export default App;

