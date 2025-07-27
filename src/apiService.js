import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const response = await apiClient.post('/directory', registrationData);
    return response.data;
  } catch (error) {
    console.error('Error submitting directory registration:', error);
    throw error;
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
