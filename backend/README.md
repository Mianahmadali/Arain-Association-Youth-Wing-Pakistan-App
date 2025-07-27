# Arain Association Youth Wing Pakistan - Backend API

A comprehensive FastAPI backend for the Arain Association Youth Wing Pakistan NGO platform, featuring user authentication, directory management, contact forms, and an AI-powered customer support agent.

## 🚀 Features

### Core Functionality
- **JWT-based Authentication** with admin and member roles
- **Directory Management** with comprehensive member registration
- **Contact Form System** with admin message management
- **AI Customer Support Agent** with OpenRouter/Kimi integration
- **File Upload Support** for profile images
- **Export Capabilities** (CSV/PDF) for admin users
- **Real-time Statistics** and analytics

### Technical Features
- **FastAPI** with automatic OpenAPI documentation
- **MongoDB Atlas** integration with Motor (async)
- **Pydantic** models for data validation
- **Poetry** for dependency management
- **Docker** support for containerized deployment
- **CORS** configuration for frontend integration
- **Comprehensive logging** and error handling

## 📦 Tech Stack

- **Framework**: FastAPI 0.104+
- **Language**: Python 3.11
- **Database**: MongoDB Atlas (Motor async driver)
- **Authentication**: JWT with passlib (bcrypt)
- **AI Integration**: OpenRouter API
- **Validation**: Pydantic v2
- **Package Manager**: Poetry
- **Deployment**: Docker + Docker Compose

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.11+
- Poetry
- MongoDB Atlas account (or local MongoDB)
- OpenRouter API key (optional, for AI features)

### 1. Clone and Setup Environment

```bash
cd backend
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/arain_association?retryWrites=true&w=majority
DATABASE_NAME=arain_association

# JWT
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenRouter API (Optional)
OPENROUTER_API_KEY=your-openrouter-api-key
AI_MODEL=anthropic/claude-3-haiku

# Admin Account
ADMIN_EMAIL=admin@arainyouthwing.org
ADMIN_PASSWORD=admin123
```

### 3. Install Dependencies

```bash
poetry install
```

### 4. Run Development Server

```bash
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended for Development)

```bash
docker-compose up --build
```

This will start:
- FastAPI app on port 8000
- MongoDB on port 27017
- Mongo Express (DB admin) on port 8081

### Option 2: Docker Only

```bash
docker build -t arain-backend .
docker run -p 8000:8000 --env-file .env arain-backend
```

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user info
- `PATCH /me` - Update user profile
- `GET /users` - List all users (Admin)
- `PATCH /users/{id}/activate` - Activate user (Admin)
- `GET /stats` - Auth statistics (Admin)

### Directory (`/api/directory`)
- `POST /` - Create directory entry
- `GET /` - List directory entries (with filters)
- `GET /{id}` - Get specific entry
- `PUT /{id}` - Update entry (Admin)
- `DELETE /{id}` - Delete entry (Admin)
- `GET /export/csv` - Export to CSV (Admin)
- `GET /export/pdf` - Export to PDF (Admin)
- `GET /count` - Get total count

### Contact (`/api/contact`)
- `POST /` - Submit contact message
- `GET /` - List messages (Admin)
- `GET /{id}` - Get specific message (Admin)
- `PATCH /{id}/read` - Mark as read (Admin)
- `PATCH /{id}/unread` - Mark as unread (Admin)
- `DELETE /{id}` - Delete message (Admin)
- `GET /stats/count` - Message statistics (Admin)

### AI Agent (`/api/agent`)
- `POST /chat` - Chat with AI assistant
- `GET /conversations` - Get conversation history (Admin)
- `GET /conversations/stats` - Conversation statistics (Admin)

## 🗄️ Database Collections

### `users`
- User authentication and profile data
- Roles: admin, member
- Password hashing with bcrypt

### `directory`
- Member directory entries
- Complete profile information
- Profile image support

### `contact_messages`
- Contact form submissions
- Read/unread status tracking
- Admin management features

### `conversations`
- AI chatbot interactions
- Session-based conversation tracking
- Analytics data

## 🤖 AI Assistant Features

The AI assistant is designed to:
- Help users with organization information
- Guide directory registration process
- Assist with contact form submissions
- Answer questions about services
- Collect user information conversationally

### AI Capabilities
- **Contextual Responses** based on user intent
- **Smart Suggestions** for next actions
- **Fallback Responses** when API is unavailable
- **Conversation Tracking** for analytics
- **Multi-language Support** (English/Urdu)

## 🔐 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt
- **Role-Based Access Control** (Admin/Member)
- **Input Validation** with Pydantic models
- **CORS Configuration** for frontend security
- **Environment-based Configuration**

## 📊 Admin Panel Support

Backend provides comprehensive admin endpoints for:
- **User Management** (activate/deactivate accounts)
- **Directory Management** (view/edit/delete entries)
- **Contact Message Management** (read/unread/delete)
- **AI Conversation Analytics**
- **Data Export** (CSV/PDF formats)
- **Real-time Statistics**

## 🚀 Production Deployment

### Environment Configuration
```env
DEBUG=False
SECRET_KEY=your-production-secret-key
MONGODB_URL=your-production-mongodb-url
ALLOWED_ORIGINS=https://yourdomain.com
```

### Recommended Setup
1. Use MongoDB Atlas for database
2. Deploy on cloud platforms (AWS, GCP, Heroku)
3. Set up SSL/TLS certificates
4. Configure environment variables
5. Set up monitoring and logging
6. Use reverse proxy (Nginx)

### Health Checks
The API includes health check endpoints for monitoring:
- Docker health check configured
- Database connection monitoring
- Error logging and tracking

## 🧪 Testing

```bash
# Run tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=app

# Run specific test file
poetry run pytest tests/test_directory.py
```

## 📝 API Examples

### Register User
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "role": "member"
  }'
```

### Submit Directory Entry
```bash
curl -X POST "http://localhost:8000/api/directory/" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Ahmad Ali",
    "father_name": "Muhammad Ali",
    "cnic": "12345-1234567-1",
    "gender": "male",
    "phone": "+923001234567",
    "email": "ahmad@example.com",
    "qualification": "Masters",
    "profession": "Engineer",
    "city": "Lahore",
    "district": "Lahore",
    "province": "Punjab",
    "caste": "Arain",
    "marital_status": "single",
    "membership_type": "member"
  }'
```

### Chat with AI
```bash
curl -X POST "http://localhost:8000/api/agent/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to volunteer with your organization",
    "session_id": "user123"
  }'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For technical support or questions:
- Email: info@arainyouthwing.org
- GitHub Issues: [Create an issue](https://github.com/yourrepo/issues)

---

**Built with ❤️ for social impact and community welfare**
