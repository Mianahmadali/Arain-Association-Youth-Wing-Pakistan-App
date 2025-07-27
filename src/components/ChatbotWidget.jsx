import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MessageOutlined, 
  SendOutlined, 
  CloseOutlined,
  RobotOutlined
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
        title={visible ? 'Close Chat' : 'Open Chat Assistant'}
      >
        <Badge dot={!visible} offset={[-6, 6]}>
          {visible ? <CloseOutlined /> : <RobotOutlined />}
        </Badge>
      </Button>

      {visible && (
        <div className="chatbot-window fade-in">
          <div className="chatbot-header">
            <div className="d-flex align-items-center">
              <RobotOutlined className="me-2" />
              <span>AI Assistant</span>
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
              >
                {t('send')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;

