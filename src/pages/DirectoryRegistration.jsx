import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Upload, 
  Card, 
  Steps, 
  Row, 
  Col, 
  message,
  Radio
} from 'antd';
import { UploadOutlined, CheckOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { submitDirectoryRegistration } from '../apiService';

const { Option } = Select;
const { TextArea } = Input;

const DirectoryRegistration = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});

  const steps = [
    {
      title: t('personalInfo'),
      description: 'Basic personal details'
    },
    {
      title: t('contactInfo'),
      description: 'Contact information'
    },
    {
      title: t('addressInfo'),
      description: 'Address details'
    },
    {
      title: t('additionalInfo'),
      description: 'Additional information'
    }
  ];

  const provinces = [
    'Punjab',
    'Sindh',
    'Khyber Pakhtunkhwa',
    'Balochistan',
    'Islamabad Capital Territory',
    'Gilgit-Baltistan',
    'Azad Jammu and Kashmir'
  ];

  const membershipTypes = [
    'Member',
    'Donor',
    'Volunteer'
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };
      console.log('Final form data:', finalData);
      
      const result = await submitDirectoryRegistration(finalData);
      if (result.success) {
        message.success('Registration submitted successfully!');
        // Reset form and go back to first step
        form.resetFields();
        setFormData({});
        setCurrentStep(0);
      } else {
        message.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration submission error:', error);
      message.error('Registration failed. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label={t('name')}
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input placeholder="Enter your full name" className="form-control-custom" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="cnic"
                  label={t('cnic')}
                  rules={[
                    { required: true, message: 'Please enter your CNIC' },
                    { pattern: /^\d{5}-\d{7}-\d{1}$/, message: 'Please enter valid CNIC format (12345-1234567-1)' }
                  ]}
                >
                  <Input placeholder="12345-1234567-1" className="form-control-custom" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="dob"
                  label={t('dob')}
                  rules={[{ required: true, message: 'Please select your date of birth' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    placeholder="Select date of birth"
                    className="form-control-custom"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="gender"
                  label={t('gender')}
                  rules={[{ required: true, message: 'Please select your gender' }]}
                >
                  <Radio.Group>
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="fatherHusbandName"
                  label={t('fatherHusbandName')}
                  rules={[{ required: true, message: 'Please enter father/husband name' }]}
                >
                  <Input placeholder="Enter father/husband name" className="form-control-custom" />
                </Form.Item>
              </Col>
            </Row>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="education"
                  label={t('education')}
                  rules={[{ required: true, message: 'Please enter your education' }]}
                >
                  <Select placeholder="Select education level" className="form-control-custom">
                    <Option value="primary">Primary</Option>
                    <Option value="secondary">Secondary</Option>
                    <Option value="intermediate">Intermediate</Option>
                    <Option value="bachelor">Bachelor's</Option>
                    <Option value="master">Master's</Option>
                    <Option value="phd">PhD</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="occupation"
                  label={t('occupation')}
                  rules={[{ required: true, message: 'Please enter your occupation' }]}
                >
                  <Input placeholder="Enter your occupation" className="form-control-custom" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label={t('phone')}
                  rules={[
                    { required: true, message: 'Please enter your phone number' },
                    { pattern: /^\+92\d{10}$/, message: 'Please enter valid phone format (+92XXXXXXXXXX)' }
                  ]}
                >
                  <Input placeholder="+92XXXXXXXXXX" className="form-control-custom" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="whatsapp"
                  label={t('whatsapp')}
                  rules={[
                    { pattern: /^\+92\d{10}$/, message: 'Please enter valid WhatsApp format (+92XXXXXXXXXX)' }
                  ]}
                >
                  <Input placeholder="+92XXXXXXXXXX" className="form-control-custom" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="email"
                  label={t('email')}
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter valid email address' }
                  ]}
                >
                  <Input placeholder="Enter your email address" className="form-control-custom" />
                </Form.Item>
              </Col>
            </Row>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="province"
                  label={t('province')}
                  rules={[{ required: true, message: 'Please select your province' }]}
                >
                  <Select placeholder="Select province" className="form-control-custom">
                    {provinces.map(province => (
                      <Option key={province} value={province}>{province}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="district"
                  label={t('district')}
                  rules={[{ required: true, message: 'Please enter your district' }]}
                >
                  <Input placeholder="Enter your district" className="form-control-custom" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="tehsil"
                  label={t('tehsil')}
                  rules={[{ required: true, message: 'Please enter your tehsil' }]}
                >
                  <Input placeholder="Enter your tehsil" className="form-control-custom" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="unionCouncil"
                  label={t('unionCouncil')}
                >
                  <Input placeholder="Enter your union council" className="form-control-custom" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="address"
                  label={t('address')}
                  rules={[{ required: true, message: 'Please enter your complete address' }]}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Enter your complete address" 
                    className="form-control-custom" 
                  />
                </Form.Item>
              </Col>
            </Row>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="caste"
                  label={t('caste')}
                >
                  <Input placeholder="Enter your caste/baradari" className="form-control-custom" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="membershipType"
                  label={t('membershipType')}
                  rules={[{ required: true, message: 'Please select membership type' }]}
                >
                  <Select placeholder="Select membership type" className="form-control-custom">
                    {membershipTypes.map(type => (
                      <Option key={type} value={type}>{type}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="remarks"
                  label={t('remarks')}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Any additional remarks or comments" 
                    className="form-control-custom" 
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="profilePhoto"
                  label={t('profilePhoto')}
                >
                  <Upload
                    name="photo"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload Photo</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="directory-registration py-5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">Join Our Directory</h1>
            <p className="lead text-muted">
              Register with us to become part of our community and help make a difference
            </p>
          </div>

          <Row justify="center">
            <Col xs={24} lg={16}>
              <Card className="card-custom p-4">
                {/* Step Progress */}
                <div className="step-progress mb-5">
                  {steps.map((step, index) => (
                    <React.Fragment key={index}>
                      <div className={`step-item ${
                        index === currentStep ? 'step-active' : 
                        index < currentStep ? 'step-completed' : 'step-inactive'
                      }`}>
                        <div className="step-number">
                          {index < currentStep ? <CheckOutlined /> : index + 1}
                        </div>
                        <div className="step-title">{step.title}</div>
                        <div className="step-description">{step.description}</div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`step-line ${index < currentStep ? 'completed' : ''}`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  initialValues={formData}
                >
                  {renderStepContent()}

                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      size="large"
                    >
                      {t('previous')}
                    </Button>

                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="primary"
                        onClick={handleNext}
                        size="large"
                        className="btn-primary-custom"
                      >
                        {t('next')}
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                        size="large"
                        className="btn-secondary-custom"
                      >
                        {t('submit')}
                      </Button>
                    )}
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </div>
    </div>
  );
};

export default DirectoryRegistration;
