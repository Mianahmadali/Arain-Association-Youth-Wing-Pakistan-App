import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getDirectoryCount = async () => {
  try {
    const response = await apiClient.get('/directory/count');
    return response.data;
  } catch (error) {
    console.error('Error fetching directory count:', error);
    throw error;
  }
};

export const submitContactForm = async (contactData) => {
  try {
    const response = await apiClient.post('/contact', contactData);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

export const submitDirectoryRegistration = async (registrationData) => {
  try {
    console.log('Submitting registration data:', registrationData);
    const response = await apiClient.post('/directory/', registrationData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error submitting directory registration:');
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    console.error('Response headers:', error.response?.headers);
    console.error('Request data:', registrationData);

    // Return error details for better handling
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

export const chatWithAI = async (message, sessionId = null) => {
  try {
    const response = await apiClient.post('/agent/chat', {
      message: message,
      session_id: sessionId
    });
    return response.data;
  } catch (error) {
    console.error('Error chatting with AI:', error);
    throw error;
  }
};

// Admin Authentication
export const loginAdmin = async (username, password) => {
  try {
    console.log('Attempting admin login...');
    const response = await apiClient.post('/auth/login', {
      email: username, // Backend expects 'email' field, not 'username'
      password
    });
    
    console.log('Login response:', response.data);
    
    // Check if response contains a token
    if (response.data && response.data.access_token) {
      // Store the token in localStorage
      localStorage.setItem('admin_token', response.data.access_token);
      console.log('Token stored successfully');
      return {
        success: true,
        data: response.data
      };
    } else {
      console.error('No token received in login response');
      return {
        success: false,
        error: 'Invalid response format - no token received'
      };
    }
  } catch (error) {
    console.error('Admin login error:');
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    console.error('Response headers:', error.response?.headers);
    
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

// Admin Dashboard API endpoints
export const getMembers = async () => {
  try {
    const response = await apiClient.get('/directory/');
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const getContactMessages = async () => {
  try {
    const response = await apiClient.get('/contact/');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};

export const getAdminStats = async () => {
  try {
    const response = await apiClient.get('/auth/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

export const updateMemberStatus = async (memberId, status) => {
  try {
    const response = await apiClient.patch(`/directory/${memberId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating member status:', error);
    throw error;
  }
};

export const deleteMember = async (memberId) => {
  try {
    const response = await apiClient.delete(`/directory/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

export const deleteContactMessage = async (messageId) => {
  try {
    const response = await apiClient.delete(`/contact/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting contact message:', error);
    throw error;
  }
};

export const getCommunityStrength = async () => {
  try {
    const response = await apiClient.get('/directory/community_strength');
    return response.data;
  } catch (error) {
    console.error('Error fetching community strength:', error);
    throw error;
  }
};
