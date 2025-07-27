import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Card, Row, Col, message } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { submitContactForm } from '../apiService';

const { TextArea } = Input;

const ContactUs = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      console.log('Contact form data:', values);
      const result = await submitContactForm(values);
      if (result.success) {
        message.success('Message sent successfully! We will get back to you soon.');
        form.resetFields();
      } else {
        message.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      message.error('Failed to send message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: <MailOutlined className="text-primary" style={{ fontSize: '24px' }} />,
      title: 'Email',
      description: 'info@arainyouthwing.org',
      link: 'mailto:info@arainyouthwing.org'
    },
    {
      icon: <PhoneOutlined className="text-success" style={{ fontSize: '24px' }} />,
      title: 'Phone',
      description: '+92 300 1234567',
      link: 'tel:+923001234567'
    },
    {
      icon: <EnvironmentOutlined className="text-danger" style={{ fontSize: '24px' }} />,
      title: 'Address',
      description: 'Main Office, Lahore, Punjab, Pakistan',
      link: '#'
    },
    {
      icon: <ClockCircleOutlined className="text-warning" style={{ fontSize: '24px' }} />,
      title: 'Office Hours',
      description: 'Mon - Fri: 9:00 AM - 6:00 PM',
      link: '#'
    }
  ];

  const socialMedia = [
    { icon: <FacebookOutlined />, name: 'Facebook', link: '#', color: '#1877F2' },
    { icon: <TwitterOutlined />, name: 'Twitter', link: '#', color: '#1DA1F2' },
    { icon: <InstagramOutlined />, name: 'Instagram', link: '#', color: '#E4405F' },
    { icon: <LinkedinOutlined />, name: 'LinkedIn', link: '#', color: '#0A66C2' }
  ];

  return (
    <div className="contact-us py-5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">Get In Touch</h1>
            <p className="lead text-muted">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <Row gutter={[32, 32]}>
            {/* Contact Form */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card className="card-custom h-100">
                  <h3 className="fw-bold mb-4">Send us a Message</h3>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="name"
                          label="Full Name"
                          rules={[{ required: true, message: 'Please enter your name' }]}
                        >
                          <Input placeholder="Enter your full name" className="form-control-custom" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="email"
                          label="Email Address"
                          rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter valid email' }
                          ]}
                        >
                          <Input placeholder="Enter your email" className="form-control-custom" />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                      <Input placeholder="Enter your phone number" className="form-control-custom" />
                    </Form.Item>

                    <Form.Item
                      name="subject"
                      label="Subject"
                      rules={[{ required: true, message: 'Please enter subject' }]}
                    >
                      <Input placeholder="Enter message subject" className="form-control-custom" />
                    </Form.Item>

                    <Form.Item
                      name="message"
                      label="Message"
                      rules={[{ required: true, message: 'Please enter your message' }]}
                    >
                      <TextArea
                        rows={6}
                        placeholder="Enter your message"
                        className="form-control-custom"
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="btn-primary-custom w-100"
                    >
                      Send Message
                    </Button>
                  </Form>
                </Card>
              </motion.div>
            </Col>

            {/* Contact Information */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card className="card-custom h-100">
                  <h3 className="fw-bold mb-4">Contact Information</h3>
                  
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.4 }}
                      className="mb-4"
                    >
                      <div className="d-flex align-items-start">
                        <div className="feature-icon me-3" style={{ minWidth: '60px' }}>
                          {info.icon}
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1">{info.title}</h5>
                          {info.link.startsWith('#') ? (
                            <p className="text-muted mb-0">{info.description}</p>
                          ) : (
                            <a 
                              href={info.link} 
                              className="text-decoration-none text-muted"
                              target={info.link.startsWith('http') ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                            >
                              {info.description}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="mt-5">
                    <h5 className="fw-bold mb-3">Follow Us</h5>
                    <div className="d-flex gap-3">
                      {socialMedia.map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.link}
                          className="text-decoration-none"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div 
                            className="feature-icon"
                            style={{ 
                              background: social.color,
                              width: '45px',
                              height: '45px',
                              fontSize: '20px'
                            }}
                          >
                            {social.icon}
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-5"
          >
            <Card className="card-custom">
              <h3 className="fw-bold mb-4">Find Us</h3>
              <div 
                className="map-placeholder rounded-custom"
                style={{
                  height: '400px',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #dee2e6'
                }}
              >
                <div className="text-center">
                  <EnvironmentOutlined style={{ fontSize: '48px', color: '#6c757d' }} />
                  <h5 className="mt-3 text-muted">Interactive Map</h5>
                  <p className="text-muted">
                    Main Office: Lahore, Punjab, Pakistan<br />
                    <small>Map integration can be added with Google Maps API</small>
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-5"
          >
            <Card className="card-custom">
              <h3 className="fw-bold mb-4">Frequently Asked Questions</h3>
              <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                  <div className="mb-4">
                    <h5 className="fw-bold">How can I join as a volunteer?</h5>
                    <p className="text-muted">
                      You can register through our Directory Registration form and select "Volunteer" as your membership type. We'll contact you with available opportunities.
                    </p>
                  </div>
                  <div className="mb-4">
                    <h5 className="fw-bold">What types of projects do you run?</h5>
                    <p className="text-muted">
                      We focus on education, healthcare, and community welfare projects including scholarships, medical camps, and infrastructure development.
                    </p>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="mb-4">
                    <h5 className="fw-bold">How can I donate to your cause?</h5>
                    <p className="text-muted">
                      You can contact us directly through the form above or call our office. We accept donations through various methods including bank transfers.
                    </p>
                  </div>
                  <div className="mb-4">
                    <h5 className="fw-bold">Do you provide certificates for volunteers?</h5>
                    <p className="text-muted">
                      Yes, we provide certificates of appreciation and community service hours documentation for all our active volunteers.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
