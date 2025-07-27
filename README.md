# Arain-Association-Youth-Wing-Pakistan-App
A responsive web and mobile UI platform for the Arain Association Youth Wing Pakistan NGO, designed to register members, manage contact inquiries, and display welfare initiatives.

## 🌟 Features

### Design System
- **Color Palette**: Deep Blue (#003366), Emerald Green (#2ecc71), and White
- **Typography**: Poppins for English, Noto Nastaliq Urdu for Urdu text
- **Style**: Clean, professional design with soft gradients, shadows, and rounded corners
- **Responsive**: Mobile-first design approach

### Pages Included

1. **Home Page**
   - Hero section with motivational message
   - Call-to-action buttons: "Join Directory" and "Contact Us"
   - Feature highlights: Education, Healthcare, Welfare Projects, Donate Now
   - Real-time statistics (total members, active volunteers, projects completed, beneficiaries)
   - Testimonials carousel
   - Social impact messaging

2. **Directory Registration Form (Multi-step)**
   - Step 1: Personal Information (Name, CNIC, DOB, Gender, Father/Husband Name)
   - Step 2: Contact Information (Education, Occupation, Phone, WhatsApp, Email)
   - Step 3: Address Information (Province, District, Tehsil, Union Council, Address)
   - Step 4: Additional Information (Caste/Baradari, Membership Type, Remarks, Profile Photo)
   - Horizontal step progress indicator
   - Form validation and error handling

3. **Contact Us Page**
   - Contact form with validation
   - Organization contact information
   - Interactive map placeholder
   - Social media links
   - FAQ section

4. **Admin Dashboard**
   - Secure login screen (Demo: admin/admin123)
   - Statistics overview dashboard
   - Directory member management with search, filter, and pagination
   - Contact message management
   - Export functionality
   - Member detail modal views

5. **AI Chatbot Widget**
   - Floating chat assistant
   - Bilingual support (Urdu/English)
   - Intelligent responses for common queries
   - Contextual help for form completion
   - Modern chat interface

### Technical Features
- **Internationalization**: Complete Urdu/English language support
- **Animations**: Smooth transitions using Framer Motion
- **Responsive Design**: Mobile-first approach with Bootstrap and Ant Design
- **Modern UI Components**: Custom styled components with consistent design system
- **Form Handling**: Multi-step forms with validation
- **State Management**: React hooks for local state management

## 🚀 Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 4.4.5
- **UI Libraries**: 
  - Ant Design 5.8.6
  - React Bootstrap 2.8.0
  - Bootstrap 5.3.0
- **Routing**: React Router DOM 6.15.0
- **Internationalization**: react-i18next 13.2.0
- **Animations**: Framer Motion 10.16.4
- **Icons**: Ant Design Icons, Lucide React
- **HTTP Client**: Axios 1.5.0
- **Styling**: Custom CSS with CSS Variables

## 📦 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone/Download the project** (if not already done)

2. **Enable PowerShell script execution** (Windows only):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Development server: http://localhost:3000
   - The application will automatically open in your default browser

## 🎨 Design Guidelines

### Color System
```css
:root {
  --primary-blue: #003366;
  --primary-green: #2ecc71;
  --primary-white: #ffffff;
  --text-dark: #2c3e50;
  --text-light: #7f8c8d;
  --background-light: #f8f9fa;
}
```

### Typography
- **English**: Poppins (300, 400, 500, 600, 700)
- **Urdu**: Noto Nastaliq Urdu (400, 500, 600, 700)

### Component Classes
- `.btn-primary-custom` - Primary action buttons
- `.btn-secondary-custom` - Secondary action buttons
- `.card-custom` - Custom card components
- `.form-control-custom` - Form input styling
- `.stats-card` - Statistics display cards
- `.feature-icon` - Icon containers

## 🌐 Internationalization

The application supports both English and Urdu languages:

- Language switcher in the navbar
- RTL support for Urdu text
- Contextual translations for all UI elements
- Bilingual chatbot responses

## 📱 Responsive Breakpoints

- **xs**: < 576px (Mobile)
- **sm**: ≥ 576px (Mobile landscape)
- **md**: ≥ 768px (Tablet)
- **lg**: ≥ 992px (Desktop)
- **xl**: ≥ 1200px (Large desktop)

## 🔧 Admin Dashboard

Access the admin dashboard at `/admin-dashboard`

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

### Admin Features:
- Member directory management
- Contact message handling
- Data export capabilities
- Real-time statistics
- Search and filtering

## 🤖 AI Chatbot Features

The AI chatbot provides intelligent responses for:
- Volunteer registration guidance
- Donation information
- Contact details
- Educational programs
- Healthcare services
- General organization information

## 📄 Project Structure

```
src/
├── components/
│   └── ChatbotWidget.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── DirectoryRegistration.jsx
│   ├── ContactUs.jsx
│   └── AdminDashboard.jsx
├── i18n/
│   └── i18n.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🎯 Goals Achieved

✅ **Trustworthy Design**: Professional appearance with clean layout  
✅ **Youthful Appeal**: Modern design elements and vibrant colors  
✅ **Social Impact Focus**: Clear messaging about community welfare  
✅ **User-Friendly**: Intuitive navigation and form interactions  
✅ **Mobile-First**: Responsive design for all device types  
✅ **Accessibility**: Proper contrast ratios and semantic HTML  
✅ **Performance**: Optimized loading and smooth animations  

## 🚀 Future Enhancements

- Backend API integration
- Real-time notifications
- Payment gateway integration
- Google Maps integration
- Advanced analytics dashboard
- Mobile app development
- Email automation system

## 📞 Support

For technical support or questions about this project:
- Email: info@arainyouthwing.org
- Phone: +92 300 1234567

---

**Built with ❤️ for social impact and community welfare**
