import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MessageOutlined, 
  SendOutlined, 
  CloseOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { Input, Button, Badge, Tag } from 'antd';
import { chatWithAI } from '../apiService';

const ChatbotWidget = ({ language }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { sender: 'bot', text: t('chatbotGreeting') }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [suggestedActions, setSuggestedActions] = useState([]);

  // Update greeting message when language changes
  useEffect(() => {
    setConversation([{ sender: 'bot', text: t('chatbotGreeting') }]);
  }, [language, t]);

  const toggleChatbot = () => {
    setVisible(!visible);
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newConversation = [...conversation, { sender: 'user', text: message }];
      setConversation(newConversation);
      setMessage('');
setIsTyping(true);

      // Call the backend AI to get response
      chatWithAI(message, sessionId)
        .then((result) => {
          const { response, session_id, suggested_actions } = result;
          setIsTyping(false);
          setSessionId(session_id);
          setSuggestedActions(suggested_actions);
          setConversation([...newConversation, { sender: 'bot', text: response }]);
        })
        .catch((error) => {
          console.error('Error in AI chat:', error);
          setIsTyping(false);
          setConversation([...newConversation, { sender: 'bot', text: t('chatbotError') }]);
        });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-widget">
      <Button 
        className="chatbot-toggle"
        onClick={toggleChatbot}
        title={visible ? 'Close Chat' : 'Open AI Assistant 🤖'}
        style={{
          background: visible ? '#ff4d4f' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: visible ? '0 4px 15px rgba(255, 77, 79, 0.4)' : '0 4px 15px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease'
        }}
      >
        <Badge dot={!visible} offset={[-8, 8]}>
          {visible ? (
            <CloseOutlined style={{ fontSize: '20px', color: 'white' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ThunderboltOutlined style={{ fontSize: '18px', color: 'white' }} />
              <span style={{ fontSize: '16px', color: 'white' }}>🤖</span>
            </div>
          )}
        </Badge>
      </Button>

      {visible && (
        <div className="chatbot-window fade-in">
          <div className="chatbot-header">
            <div className="d-flex align-items-center">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BulbOutlined className="me-1" style={{ fontSize: '18px', color: '#667eea' }} />
                <span style={{ fontSize: '16px' }}>🤖</span>
                <span style={{ fontWeight: '600', color: 'white' }}>AI Assistant</span>
              </div>
            </div>
            <CloseOutlined 
              onClick={toggleChatbot} 
              className="cursor-pointer" 
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div className="chatbot-messages">
            {conversation.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.sender} ${language === 'ur' && msg.sender === 'bot' ? 'urdu-text' : ''}`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="loading-spinner"></div>
                <span className="ms-2">Typing...</span>
              </div>
            )}
            {suggestedActions.length > 0 && (
              <div className="suggested-actions mt-2">
                <div className="mb-2"><small>Suggested actions:</small></div>
                <div className="d-flex flex-wrap gap-1">
                  {suggestedActions.map((action, index) => (
                    <Tag 
                      key={index} 
                      color="blue" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setMessage(action);
                        // Optionally auto-send the suggested action
                        // sendMessage();
                      }}
                    >
                      {action}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <div className="d-flex gap-2">
              <Input
                placeholder={t('chatbotPlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={sendMessage}
                disabled={!message.trim()}
                className="btn-primary-custom"
                style={{ color: 'white' }}
              >
                🤖 {t('send')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;

