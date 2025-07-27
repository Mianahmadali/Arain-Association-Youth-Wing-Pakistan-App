import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Carousel, Statistic } from 'antd';
import { 
  BookOutlined, 
  HeartOutlined, 
  GiftOutlined, 
  DollarOutlined,
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import APITest from '../components/APITest';

const HomePage = () => {
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
                <div style={{ fontSize: '200px', lineHeight: 1 }}>🌟</div>
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

      {/* API Test Section */}
      <section className="py-5">
        <div className="container">
          <APITest />
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

      {/* Testimonials Section */}
      <section className="py-5 bg-white">
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
    </div>
  );
};

export default HomePage;
