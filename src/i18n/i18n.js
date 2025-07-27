import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "home": "Home",
      "joinDirectory": "Join Directory",
      "contactUs": "Contact Us",
      "dashboard": "Dashboard",
      "heroTitle": "Empowering Youth for a Brighter Tomorrow",
      "heroSubtitle": "Join Arain Association Youth Wing Pakistan in making a positive impact in our community through education, healthcare, and welfare initiatives.",
      "education": "Education",
      "healthcare": "Healthcare",
      "welfare": "Welfare Projects",
      "donate": "Donate Now",
      "totalMembers": "Total Members",
      "activeVolunteers": "Active Volunteers",
      "projectsCompleted": "Projects Completed",
      "beneficiaries": "Beneficiaries",
      "testimonials": "What People Say",
      "missionStatement": "Our mission is to empower youth for a brighter tomorrow through education, healthcare, and community welfare initiatives.",
      "personalInfo": "Personal Information",
      "contactInfo": "Contact Information",
      "addressInfo": "Address Information",
      "additionalInfo": "Additional Information",
      "name": "Full Name",
      "cnic": "CNIC",
      "dob": "Date of Birth",
      "gender": "Gender",
      "fatherHusbandName": "Father/Husband Name",
      "education": "Education",
      "occupation": "Occupation",
      "phone": "Phone",
      "whatsapp": "WhatsApp",
      "email": "Email",
      "province": "Province",
      "district": "District",
      "tehsil": "Tehsil",
      "unionCouncil": "Union Council",
      "address": "Address",
      "caste": "Caste/Baradari",
      "membershipType": "Membership Type",
      "remarks": "Remarks",
      "profilePhoto": "Profile Photo",
      "submit": "Submit",
      "previous": "Previous",
      "next": "Next",
      "chatbotGreeting": "Hello! How can I help you today?",
      "chatbotPlaceholder": "Type your message...",
      "send": "Send"
    }
  },
  ur: {
    translation: {
      "home": "گھر",
      "joinDirectory": "ڈائرکٹری میں شامل ہوں",
      "contactUs": "رابطہ کریں",
      "dashboard": "ڈیش بورڈ",
      "heroTitle": "نوجوانوں کو بہتر کل کے لیے با اختیار بنانا",
      "heroSubtitle": "آرائین ایسوسی ایشن یوتھ ونگ پاکستان کے ساتھ تعلیم، صحت اور فلاحی اقدامات کے ذریعے اپنی کمیونٹی میں مثبت تبدیلی لانے میں شامل ہوں۔",
      "education": "تعلیم",
      "healthcare": "صحت کی دیکھ بھال",
      "welfare": "فلاحی منصوبے",
      "donate": "اب عطیہ کریں",
      "totalMembers": "کل ممبران",
      "activeVolunteers": "فعال رضاکار",
      "projectsCompleted": "مکمل شدہ منصوبے",
      "beneficiaries": "مستفید افراد",
      "testimonials": "لوگ کیا کہتے ہیں",
      "missionStatement": "ہمارا مشن تعلیم، صحت اور کمیونٹی فلاح کے اقدامات کے ذریعے نوجوانوں کو بہتر کل کے لیے با اختیار بنانا ہے۔",
      "personalInfo": "ذاتی معلومات",
      "contactInfo": "رابطے کی معلومات",
      "addressInfo": "پتے کی معلومات",
      "additionalInfo": "اضافی معلومات",
      "name": "پورا نام",
      "cnic": "شناختی کارڈ نمبر",
      "dob": "تاریخ پیدائش",
      "gender": "جنس",
      "fatherHusbandName": "والد/شوہر کا نام",
      "education": "تعلیم",
      "occupation": "پیشہ",
      "phone": "فون",
      "whatsapp": "واٹس ایپ",
      "email": "ای میل",
      "province": "صوبہ",
      "district": "ضلع",
      "tehsil": "تحصیل",
      "unionCouncil": "یونین کونسل",
      "address": "پتہ",
      "caste": "ذات/برادری",
      "membershipType": "رکنیت کی قسم",
      "remarks": "تبصرے",
      "profilePhoto": "پروفائل تصویر",
      "submit": "جمع کریں",
      "previous": "پچھلا",
      "next": "اگلا",
      "chatbotGreeting": "السلام علیکم! آج میں آپ کی کیسے مدد کر سکتا ہوں؟",
      "chatbotPlaceholder": "اپنا پیغام ٹائپ کریں...",
      "send": "بھیجیں"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
