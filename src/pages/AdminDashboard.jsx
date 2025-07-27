import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Table, 
  Modal, 
  Row, 
  Col, 
  Statistic, 
  Badge,
  Select,
  Space,
  notification,
  Tabs,
  Avatar,
  Typography
} from 'antd';
import { 
  UserOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  BellOutlined,
  TeamOutlined,
  ProjectOutlined,
  DollarOutlined,
  TrophyOutlined,
  LockOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm] = Form.useForm();
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in real app, this would come from API
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Ahmad Ali Khan',
      email: 'ahmad@example.com',
      phone: '+92 300 1234567',
      cnic: '12345-1234567-1',
      membershipType: 'Volunteer',
      province: 'Punjab',
      district: 'Lahore',
      status: 'Active',
      joinDate: '2023-06-15',
      profilePhoto: null
    },
    {
      id: 2,
      name: 'Fatima Sheikh',
      email: 'fatima@example.com',
      phone: '+92 301 7654321',
      cnic: '54321-7654321-2',
      membershipType: 'Donor',
      province: 'Sindh',
      district: 'Karachi',
      status: 'Active',
      joinDate: '2023-07-20',
      profilePhoto: null
    },
    {
      id: 3,
      name: 'Hassan Ahmed',
      email: 'hassan@example.com',
      phone: '+92 302 9876543',
      cnic: '98765-9876543-3',
      membershipType: 'Member',
      province: 'Khyber Pakhtunkhwa',
      district: 'Peshawar',
      status: 'Pending',
      joinDate: '2023-08-10',
      profilePhoto: null
    }
  ]);

  const [contactMessages] = useState([
    {
      id: 1,
      name: 'Ali Hassan',
      email: 'ali@example.com',
      subject: 'Volunteer Opportunity',
      message: 'I am interested in volunteering for your education projects.',
      date: '2023-08-25',
      status: 'Unread'
    },
    {
      id: 2,
      name: 'Sarah Khan',
      email: 'sarah@example.com',
      subject: 'Donation Inquiry',
      message: 'How can I make a donation to your healthcare initiatives?',
      date: '2023-08-24',
      status: 'Read'
    }
  ]);

  const stats = [
    { title: 'Total Members', value: 2500, icon: <UserOutlined />, color: '#003366' },
    { title: 'Active Volunteers', value: 450, icon: <TeamOutlined />, color: '#2ecc71' },
    { title: 'Projects Completed', value: 120, icon: <ProjectOutlined />, color: '#003366' },
    { title: 'Total Donations', value: '₨2.5M', icon: <DollarOutlined />, color: '#2ecc71' }
  ];

  const handleLogin = async (values) => {
    // Mock login - in real app, validate against backend
    if (values.username === 'admin' && values.password === 'admin123') {
      setIsLoggedIn(true);
      notification.success({
        message: 'Login Successful',
        description: 'Welcome to Admin Dashboard'
      });
    } else {
      notification.error({
        message: 'Login Failed',
        description: 'Invalid username or password'
      });
    }
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setViewModalVisible(true);
  };

  const handleDeleteMember = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this member?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setMembers(members.filter(member => member.id !== id));
        notification.success({
          message: 'Member deleted successfully'
        });
      }
    });
  };

  const handleExportData = () => {
    // Mock export functionality
    notification.success({
      message: 'Export Started',
      description: 'Data export will be downloaded shortly'
    });
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const memberColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <Avatar icon={<UserOutlined />} className="me-2" />
          <div>
            <div className="fw-bold">{text}</div>
            <small className="text-muted">{record.email}</small>
          </div>
        </div>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Type',
      dataIndex: 'membershipType',
      key: 'membershipType',
      render: (type) => (
        <Badge 
          color={type === 'Volunteer' ? 'green' : type === 'Donor' ? 'blue' : 'orange'} 
          text={type} 
        />
      )
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => `${record.district}, ${record.province}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'Active' ? 'success' : 'processing'} 
          text={status} 
        />
      )
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewMember(record)}
          >
            View
          </Button>
          <Button 
            size="small" 
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMember(record.id)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  const messageColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'Read' ? 'default' : 'processing'} 
          text={status} 
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            View
          </Button>
        </Space>
      )
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="admin-login" style={{ minHeight: '80vh' }}>
        <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="card-custom shadow-custom-medium">
                <div className="text-center mb-4">
                  <div className="feature-icon mb-3">
                    <LockOutlined style={{ fontSize: '32px', color: 'white' }} />
                  </div>
                  <Title level={3}>Admin Login</Title>
                  <Text type="secondary">
                    Please enter your credentials to access the dashboard
                  </Text>
                </div>

                <Form
                  form={loginForm}
                  layout="vertical"
                  onFinish={handleLogin}
                >
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please enter username' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter username" 
                      className="form-control-custom"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter password' }]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="Enter password" 
                      className="form-control-custom"
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="btn-primary-custom w-100"
                    icon={<LoginOutlined />}
                  >
                    Login to Dashboard
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Demo credentials: admin / admin123
                  </Text>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="admin-dashboard py-4">
      <div className="container-fluid">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Title level={2} className="mb-1">Admin Dashboard</Title>
              <Text type="secondary">Manage your organization's data and activities</Text>
            </div>
            <div className="d-flex gap-2">
              <Button icon={<BellOutlined />} className="rounded-circle">
                <Badge count={5} size="small" />
              </Button>
              <Button 
                onClick={() => setIsLoggedIn(false)}
                danger
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[24, 24]} className="mb-4">
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className="stats-card">
                    <div className="feature-icon mb-3" style={{ background: stat.color }}>
                      {stat.icon}
                    </div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      valueStyle={{ 
                        color: stat.color, 
                        fontSize: '1.8rem', 
                        fontWeight: 'bold' 
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Main Content Tabs */}
          <Card className="card-custom">
            <Tabs defaultActiveKey="members" size="large">
              <TabPane tab="Directory Members" key="members">
                <div className="mb-4">
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                      <Input
                        placeholder="Search members..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="form-control-custom"
                      />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Select
                        placeholder="Filter by status"
                        value={filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: '100%' }}
                        className="form-control-custom"
                      >
                        <Option value="all">All Status</Option>
                        <Option value="active">Active</Option>
                        <Option value="pending">Pending</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={24} md={10}>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button 
                          type="primary" 
                          icon={<ExportOutlined />}
                          onClick={handleExportData}
                          className="btn-secondary-custom"
                        >
                          Export Data
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>

                <Table
                  dataSource={filteredMembers}
                  columns={memberColumns}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true
                  }}
                  scroll={{ x: 1000 }}
                />
              </TabPane>

              <TabPane tab="Contact Messages" key="messages">
                <Table
                  dataSource={contactMessages}
                  columns={messageColumns}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true
                  }}
                />
              </TabPane>

              <TabPane tab="Notifications" key="notifications">
                <div className="text-center py-5">
                  <BellOutlined style={{ fontSize: '48px', color: '#ccc' }} />
                  <Title level={4} className="mt-3 text-muted">No New Notifications</Title>
                  <Text type="secondary">
                    System notifications and alerts will appear here
                  </Text>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>

        {/* Member Details Modal */}
        <Modal
          title="Member Details"
          visible={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={600}
        >
          {selectedMember && (
            <div>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8} className="text-center">
                  <Avatar size={80} icon={<UserOutlined />} className="mb-3" />
                  <div>
                    <Title level={5}>{selectedMember.name}</Title>
                    <Badge 
                      status={selectedMember.status === 'Active' ? 'success' : 'processing'} 
                      text={selectedMember.status} 
                    />
                  </div>
                </Col>
                <Col xs={24} sm={16}>
                  <div className="mb-3">
                    <Text strong>Email: </Text>
                    <Text>{selectedMember.email}</Text>
                  </div>
                  <div className="mb-3">
                    <Text strong>Phone: </Text>
                    <Text>{selectedMember.phone}</Text>
                  </div>
                  <div className="mb-3">
                    <Text strong>CNIC: </Text>
                    <Text>{selectedMember.cnic}</Text>
                  </div>
                  <div className="mb-3">
                    <Text strong>Membership Type: </Text>
                    <Badge 
                      color={selectedMember.membershipType === 'Volunteer' ? 'green' : 
                             selectedMember.membershipType === 'Donor' ? 'blue' : 'orange'} 
                      text={selectedMember.membershipType} 
                    />
                  </div>
                  <div className="mb-3">
                    <Text strong>Location: </Text>
                    <Text>{selectedMember.district}, {selectedMember.province}</Text>
                  </div>
                  <div className="mb-3">
                    <Text strong>Join Date: </Text>
                    <Text>{selectedMember.joinDate}</Text>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
