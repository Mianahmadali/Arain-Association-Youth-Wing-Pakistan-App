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
  Typography,
  Spin
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
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { 
  getMembers, 
  getContactMessages, 
  getAdminStats, 
  updateMemberStatus, 
  deleteMember as deleteMemberAPI, 
  deleteContactMessage,
  loginAdmin,
  getCommunityStrength
} from '../apiService';

const { Option } = Select;
const { Title, Text } = Typography;

const AdminDashboard = ({ language = 'en', setLanguage = () => {} }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm] = Form.useForm();
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [members, setMembers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check for existing token on component mount
  useEffect(() => {
    // Force fresh login on every page refresh by clearing any existing token
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('AdminDashboard: Starting to fetch data...');
        
        const [membersData, messagesData, statsData, communityStrengthData] = await Promise.all([
          getMembers(),
          getContactMessages(),
          getAdminStats(),
          getCommunityStrength()
        ]);
        
        console.log('AdminDashboard: Fetched members data:', membersData);
        console.log('AdminDashboard: Fetched messages data:', messagesData);
        console.log('AdminDashboard: Fetched stats data:', statsData);
        console.log('AdminDashboard: Fetched community strength data:', communityStrengthData);
        
        const directoryMembers = membersData.data || [];
        const contactMessagesData = messagesData.data || [];
        
        // Normalize the member data to ensure consistent field names
        const normalizedMembers = directoryMembers.map(member => ({
          ...member,
          name: member.full_name || member.name || '',
          membershipType: member.membership_type || member.membershipType || 'member',
          joinDate: member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A',
          status: 'Active' // Default status since it's not in the backend data
        }));
        
        setMembers(normalizedMembers);
        setContactMessages(contactMessagesData);
        
        // Create combined stats showing both auth and directory data
        setStats([
          {
            title: 'Directory Members',
            value: directoryMembers.length || 0,
            color: '#1890ff',
            icon: <TeamOutlined style={{ color: 'white' }} />
          },
          {
            title: 'Contact Messages',
            value: contactMessagesData.length || 0,
            color: '#52c41a',
            icon: <ProjectOutlined style={{ color: 'white' }} />
          },
          {
            title: 'Community Strength',
            value: communityStrengthData.data?.total_family_members || 0,
            color: '#13c2c2',
            icon: <TeamOutlined style={{ color: 'white' }} />
          },
          {
            title: 'Admin Users',
            value: statsData.data?.admin_users || 0,
            color: '#722ed1',
            icon: <TrophyOutlined style={{ color: 'white' }} />
          },
          {
            title: 'Auth Users',
            value: statsData.data?.total_users || 0,
            color: '#fa8c16',
            icon: <DollarOutlined style={{ color: 'white' }} />
          }
        ]);
        
        console.log('AdminDashboard: State updated with fetched data');
      } catch (error) {
        console.error('AdminDashboard: Error fetching data:', error);
        notification.error({
          message: 'Data Fetch Error',
          description: 'There was an error fetching the dashboard data.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);


  const handleLogin = async (values) => {
    try {
      const response = await loginAdmin(values.username, values.password);
      
      if (response.success && response.data.access_token) {
        // Token is already stored in loginAdmin function
        setIsLoggedIn(true);
        notification.success({
          message: 'Login Successful',
          description: 'Welcome to Admin Dashboard'
        });
      } else {
        notification.error({
          message: 'Login Failed',
          description: response.error || 'Invalid username or password'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.detail || 'Invalid username or password'
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
      onOk: async () => {
        try {
          await deleteMemberAPI(id);
          setMembers(members.filter(member => member.id !== id));
          notification.success({
            message: 'Member deleted successfully'
          });
        } catch (error) {
          console.error('Error deleting member:', error);
          notification.error({
            message: 'Delete Failed',
            description: 'There was an error deleting the member. Please try again.'
          });
        }
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
    // Use the normalized data
    const name = member.name || '';
    const email = member.email || '';
    const status = member.status || 'active';
    
    const matchesSearch = searchText === '' || 
                         name.toLowerCase().includes(searchText.toLowerCase()) ||
                         email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const memberColumns = [
    {
      title: 'Name',
      dataIndex: 'full_name',
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
      <div className="admin-dashboard-page">
        <Header language={language} setLanguage={setLanguage} />
        <div className="admin-login" style={{ minHeight: '80vh', marginTop: '80px' }}>
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
                      autoComplete="username"
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
                      autoComplete="current-password"
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
                    Arain Association Youth Wing Pakistan
                  </Text>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <Header language={language} setLanguage={setLanguage} />
      <div className="admin-dashboard py-4" style={{ marginTop: '80px' }}>
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
                onClick={() => {
                  localStorage.removeItem('admin_token');
                  setIsLoggedIn(false);
                  notification.success({
                    message: 'Logged Out',
                    description: 'You have been successfully logged out'
                  });
                }}
                danger
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[24, 24]} className="mb-4">
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={stats.length === 5 ? 5 : 6} key={index}>
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
            <Tabs 
              defaultActiveKey="members" 
              size="large"
              items={[
                {
                  key: 'members',
                  label: 'Directory Members',
                  children: (
                    <div>
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
                    </div>
                  )
                },
                {
                  key: 'messages',
                  label: 'Contact Messages',
                  children: (
                    <Table
                      dataSource={contactMessages}
                      columns={messageColumns}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true
                      }}
                    />
                  )
                },
                {
                  key: 'notifications',
                  label: 'Notifications',
                  children: (
                    <div className="text-center py-5">
                      <BellOutlined style={{ fontSize: '48px', color: '#ccc' }} />
                      <Title level={4} className="mt-3 text-muted">No New Notifications</Title>
                      <Text type="secondary">
                        System notifications and alerts will appear here
                      </Text>
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </motion.div>

        {/* Member Details Modal */}
        <Modal
          title="Member Details"
          open={viewModalVisible}
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
      <Footer />
    </div>
  );
};

export default AdminDashboard;
