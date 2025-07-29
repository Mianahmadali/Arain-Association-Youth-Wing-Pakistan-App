import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import arain1Logo from '../assets/Arain (1).png';
import { Row, Col, Card, Button, Carousel, Statistic } from 'antd';
import { 
  BookOutlined, 
  HeartOutlined, 
  GiftOutlined, 
  DollarOutlined,
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  TrophyOutlined,
  CrownOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  StarOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HomePage = ({ language, setLanguage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      title: t('education'),
      description: 'Providing educational opportunities and scholarships to deserving students.',
      icon: <BookOutlined style={{ fontSize: '24px', color: 'white' }} />,
      color: '#003366'
    },
    {
      title: t('healthcare'),
      description: 'Free medical camps and healthcare services for underserved communities.',
      icon: <HeartOutlined style={{ fontSize: '24px', color: 'white' }} />,
      color: '#2ecc71'
    },
    {
      title: t('welfare'),
      description: 'Community development projects and welfare initiatives.',
      icon: <GiftOutlined style={{ fontSize: '24px', color: 'white' }} />,
      color: '#003366'
    },
    {
      title: t('donate'),
      description: 'Support our cause and help us make a bigger impact.',
      icon: <DollarOutlined style={{ fontSize: '24px', color: 'white' }} />,
      color: '#2ecc71'
    }
  ];

  const stats = [
    { title: t('totalMembers'), value: 2500, icon: <UserOutlined /> },
    { title: t('activeVolunteers'), value: 450, icon: <TeamOutlined /> },
    { title: t('projectsCompleted'), value: 120, icon: <ProjectOutlined /> },
    { title: t('beneficiaries'), value: 15000, icon: <TrophyOutlined /> }
  ];

  const testimonials = [
    {
      name: 'Ahmad Ali',
      role: 'Beneficiary',
      message: 'Arain Association helped me complete my education through their scholarship program. Forever grateful!',
      avatar: '👨‍🎓'
    },
    {
      name: 'Fatima Sheikh',
      role: 'Volunteer',
      message: 'Being part of this organization has been life-changing. We are making real difference in communities.',
      avatar: '👩‍⚕️'
    },
    {
      name: 'Dr. Hassan Khan',
      role: 'Medical Camp Volunteer',
      message: 'The medical camps organized by Arain Association reach the most remote areas. Excellent work!',
      avatar: '👨‍⚕️'
    }
  ];

  return (
    <div className="homepage">
      <Header language={language} setLanguage={setLanguage} />
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <Row align="middle" justify="center" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h1 className="display-4 fw-bold text-white mb-4">
                  {t('heroTitle')}
                </h1>
                <p className="lead text-white mb-5" style={{ fontSize: '1.2rem' }}>
                  {t('heroSubtitle')}
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="btn-secondary-custom"
                    onClick={() => navigate('/directory-registration')}
                  >
                    {t('joinDirectory')}
                  </Button>
                  <Button 
                    size="large" 
                    className="btn-primary-custom"
                    onClick={() => navigate('/contact-us')}
                  >
                    {t('contactUs')}
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-center"
              >
                <img 
                  src={arain1Logo} 
                  alt="Arain Association Logo" 
                  style={{ 
                    width: '300px', 
                    height: '300px', 
                    objectFit: 'contain',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </motion.div>
            </Col>
          </Row>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="stats-card text-center">
                    <div className="feature-icon mb-3">
                      {stat.icon}
                    </div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      valueStyle={{ 
                        color: '#003366', 
                        fontSize: '2rem', 
                        fontWeight: 'bold' 
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
</section>


      {/* Features Section */}
      <section className="py-5 gradient-bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Our Focus Areas</h2>
            <p className="lead text-muted">Making impact through comprehensive community development</p>
          </div>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-custom h-100 text-center p-4">
                    <div className="feature-icon mb-3" style={{ background: feature.color }}>
                      {feature.icon}
                    </div>
                    <h4 className="fw-bold mb-3">{feature.title}</h4>
                    <p className="text-muted">{feature.description}</p>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              <CrownOutlined className="me-3" style={{ color: '#003366' }} />
              Leadership Team
            </h2>
            <p className="lead text-muted">Meet our dedicated leaders who guide our mission</p>
          </div>
          <Row gutter={[24, 24]} justify="center">
            {[
              { 
                name: 'Ahmad Hassan', 
                position: 'President', 
                image: 'https://via.placeholder.com/200x200/003366/ffffff?text=AH',
                description: 'Leading the organization with vision and dedication'
              },
              { 
                name: 'Sara Ali', 
                position: 'Chairman', 
                image: 'https://via.placeholder.com/200x200/2ecc71/ffffff?text=SA',
                description: 'Overseeing strategic initiatives and growth'
              },
              { 
                name: 'Muhammad Khan', 
                position: 'General Secretary', 
                image: 'https://via.placeholder.com/200x200/003366/ffffff?text=MK',
                description: 'Managing operations and community outreach'
              },
              { 
                name: 'Fatima Sheikh', 
                position: 'Finance Secretary', 
                image: 'https://via.placeholder.com/200x200/2ecc71/ffffff?text=FS',
                description: 'Overseeing financial management and transparency'
              }
            ].map((leader, idx) => (
              <Col xs={24} sm={12} md={8} lg={6} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-custom text-center h-100 p-4">
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      style={{ 
                        borderRadius: '50%', 
                        width: '120px', 
                        height: '120px', 
                        objectFit: 'cover',
                        margin: '0 auto 1rem'
                      }} 
                    />
                    <h5 className="fw-bold mb-2">{leader.name}</h5>
                    <p className="text-primary fw-semibold mb-2">{leader.position}</p>
                    <p className="text-muted small">{leader.description}</p>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-5 gradient-bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              <CalendarOutlined className="me-3" style={{ color: '#003366' }} />
              Recent Events
            </h2>
            <p className="lead text-muted">Our impactful activities and community programs</p>
          </div>
          <Row gutter={[24, 24]} justify="center">
            {[
              { 
                image: 'https://via.placeholder.com/350x250/003366/ffffff?text=Education+Camp', 
                title: 'Education Awareness Camp',
                date: 'March 2024',
                description: 'Organized educational workshops for 200+ students'
              },
              { 
                image: 'https://via.placeholder.com/350x250/2ecc71/ffffff?text=Health+Drive', 
                title: 'Free Health Checkup Drive',
                date: 'February 2024',
                description: 'Conducted free medical checkups for 500+ families'
              },
              { 
                image: 'https://via.placeholder.com/350x250/003366/ffffff?text=Welfare+Program', 
                title: 'Community Welfare Program',
                date: 'January 2024',
                description: 'Distributed essential supplies to needy families'
              }
            ].map((event, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-custom h-100 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                    />
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="fw-bold mb-0">{event.title}</h5>
                        <small className="text-muted">{event.date}</small>
                      </div>
                      <p className="text-muted mb-0">{event.description}</p>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              <EnvironmentOutlined className="me-3" style={{ color: '#003366' }} />
              Our Presence
            </h2>
            <p className="lead text-muted">We are actively serving communities across Pakistan</p>
          </div>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={12} lg={10}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="card-custom text-center h-100 p-4">
                  <div className="feature-icon mb-3" style={{ background: '#003366' }}>
                    <EnvironmentOutlined style={{ fontSize: '24px', color: 'white' }} />
                  </div>
                  <h4 className="fw-bold mb-3">Active Cities</h4>
                  <div className="text-start">
                    {[
                      'Lahore - Punjab',
                      'Karachi - Sindh', 
                      'Islamabad - Federal Capital',
                      'Multan - Punjab',
                      'Faisalabad - Punjab',
                      'Rawalpindi - Punjab'
                    ].map((city, idx) => (
                      <div key={idx} className="d-flex align-items-center mb-2">
                        <StarOutlined className="me-2" style={{ color: '#2ecc71' }} />
                        <span style={{ fontSize: '1rem' }}>{city}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} md={12} lg={10}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="card-custom text-center h-100 p-4">
                  <div className="feature-icon mb-3" style={{ background: '#2ecc71' }}>
                    <TeamOutlined style={{ fontSize: '24px', color: 'white' }} />
                  </div>
                  <h4 className="fw-bold mb-3">Working Bodies</h4>
                  <div className="text-start">
                    {[
                      'Education Committee',
                      'Health & Medical Committee',
                      'Social Welfare Committee', 
                      'Youth Development Committee',
                      'Women Empowerment Committee',
                      'Community Development Committee'
                    ].map((body, idx) => (
                      <div key={idx} className="d-flex align-items-center mb-2">
                        <StarOutlined className="me-2" style={{ color: '#003366' }} />
                        <span style={{ fontSize: '1rem' }}>{body}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 gradient-bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">{t('testimonials')}</h2>
            <p className="lead text-muted">Stories from our community members</p>
          </div>
          <Row justify="center">
            <Col xs={24} lg={16}>
              <Carousel autoplay dots={{ className: 'custom-dots' }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index}>
                    <Card className="card-custom text-center p-4 mx-3">
                      <div style={{ fontSize: '60px', marginBottom: '1rem' }}>
                        {testimonial.avatar}
                      </div>
                      <blockquote className="blockquote mb-4">
                        <p className="lead">"{testimonial.message}"</p>
                      </blockquote>
                      <div>
                        <h5 className="fw-bold mb-1">{testimonial.name}</h5>
                        <p className="text-muted">{testimonial.role}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </Carousel>
            </Col>
          </Row>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-5 gradient-bg-primary">
        <div className="container">
          <Row align="middle" justify="center" className="text-center">
            <Col xs={24} lg={16}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="display-5 fw-bold text-white mb-4">
                  Ready to Make a Difference?
                </h2>
                <p className="lead text-white mb-5">
                  Join our community of changemakers and help us build a better tomorrow for everyone.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button 
                    size="large" 
                    className="btn-secondary-custom"
                    onClick={() => navigate('/directory-registration')}
                  >
                    Become a Member
                  </Button>
                  <Button 
                    size="large" 
                    className="btn-primary-custom"
                    style={{ background: 'white', color: '#003366' }}
                  >
                    Donate Now
                  </Button>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
