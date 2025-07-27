import React, { useState, useEffect } from 'react';
import { Button, Card, Alert } from 'antd';
import { getDirectoryCount } from '../apiService';

const APITest = () => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      console.log('Testing API connection...');
      const result = await getDirectoryCount();
      console.log('API response:', result);
      setData(result);
      setStatus('success');
    } catch (err) {
      console.error('API test error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      setError(err.response?.data?.detail || err.message || 'Unknown error occurred');
      setStatus('error');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card title="API Connection Test" style={{ margin: '20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" onClick={testConnection} loading={status === 'loading'}>
          Test Backend Connection
        </Button>
      </div>
      
      {status === 'loading' && <Alert message="Testing connection..." type="info" />}
      
      {status === 'success' && (
        <Alert 
          message="Backend Connected Successfully!" 
          description={`Directory count: ${data?.data?.total || 'N/A'}`}
          type="success" 
        />
      )}
      
      {status === 'error' && (
        <Alert 
          message="Backend Connection Failed" 
          description={error}
          type="error" 
        />
      )}
    </Card>
  );
};

export default APITest;
