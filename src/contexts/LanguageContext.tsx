
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Available languages
export type Language = 'fr' | 'ar';

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translation data
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Common
    'tbibdaba': 'TbibDaba',
    'welcome': 'Bienvenue sur TbibDaba',
    'login': 'Connexion',
    'register': 'Inscription',
    'logout': 'Déconnexion',
    'dashboard': 'Tableau de bord',
    'profile': 'Profil',
    'search': 'Rechercher',
    'appointments': 'Rendez-vous',
    'messages': 'Messages',
    'analytics': 'Analytique',
    'settings': 'Paramètres',
    'help': 'Aide',
    
    // Dashboard
    'welcome_back': 'Bienvenue',
    'upcoming_appointments': 'Rendez-vous à venir',
    'recent_history': 'Historique récent',
    'recommended_doctors': 'Médecins recommandés',
    'find_doctor': 'Trouvez un médecin',
    'no_appointments': 'Aucun rendez-vous prévu',
    
    // Doctor search
    'search_doctor': 'Rechercher un médecin',
    'specialty': 'Spécialité',
    'city': 'Ville',
    'availability': 'Disponibilité',
    'book_appointment': 'Prendre rendez-vous',
    'view_profile': 'Voir profil',
    'no_doctors_found': 'Aucun médecin trouvé',
    
    // Appointment
    'appointment_date': 'Date du rendez-vous',
    'appointment_time': 'Heure du rendez-vous',
    'appointment_type': 'Type de rendez-vous',
    'appointment_status': 'Statut du rendez-vous',
    'cancel_appointment': 'Annuler le rendez-vous',
    'reschedule': 'Reprogrammer',
    
    // Profile
    'personal_information': 'Informations personnelles',
    'medical_information': 'Informations médicales',
    'notification_preferences': 'Préférences de notification',
    'save_changes': 'Enregistrer les modifications',
    
    // About
    'about_title': 'À propos de TbibDaba',
    'mission': 'Pour connecter les patients avec des soins de santé de confiance, à tout moment, n\'importe où.',
    'value_trust': 'Confiance',
    'value_care': 'Soins',
    'value_accessibility': 'Accessibilité',
    'value_simplicity': 'Simplicité',
  },
  ar: {
    // Common
    'tbibdaba': 'طبيب دابا',
    'welcome': 'مرحبًا بك في طبيب دابا',
    'login': 'تسجيل الدخول',
    'register': 'التسجيل',
    'logout': 'تسجيل الخروج',
    'dashboard': 'لوحة المعلومات',
    'profile': 'الملف الشخصي',
    'search': 'البحث',
    'appointments': 'المواعيد',
    'messages': 'الرسائل',
    'analytics': 'التحليلات',
    'settings': 'الإعدادات',
    'help': 'المساعدة',
    
    // Dashboard
    'welcome_back': 'مرحبًا بعودتك',
    'upcoming_appointments': 'المواعيد القادمة',
    'recent_history': 'التاريخ الحديث',
    'recommended_doctors': 'الأطباء الموصى بهم',
    'find_doctor': 'ابحث عن طبيب',
    'no_appointments': 'لا توجد مواعيد مجدولة',
    
    // Doctor search
    'search_doctor': 'البحث عن طبيب',
    'specialty': 'التخصص',
    'city': 'المدينة',
    'availability': 'التوفر',
    'book_appointment': 'حجز موعد',
    'view_profile': 'عرض الملف الشخصي',
    'no_doctors_found': 'لم يتم العثور على أطباء',
    
    // Appointment
    'appointment_date': 'تاريخ الموعد',
    'appointment_time': 'وقت الموعد',
    'appointment_type': 'نوع الموعد',
    'appointment_status': 'حالة الموعد',
    'cancel_appointment': 'إلغاء الموعد',
    'reschedule': 'إعادة جدولة',
    
    // Profile
    'personal_information': 'المعلومات الشخصية',
    'medical_information': 'المعلومات الطبية',
    'notification_preferences': 'تفضيلات الإشعارات',
    'save_changes': 'حفظ التغييرات',
    
    // About
    'about_title': 'نبذة عن طبيب دابا',
    'mission': 'لربط المرضى بالرعاية الصحية التي يثقون بها، في أي وقت وفي أي مكان.',
    'value_trust': 'الثقة',
    'value_care': 'الرعاية',
    'value_accessibility': 'سهولة الوصول',
    'value_simplicity': 'البساطة',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Try to get saved language from localStorage, default to French
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'fr';
  });

  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update dir attribute for RTL support
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Apply RTL-specific styles
    if (lang === 'ar') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  };

  // Initialize RTL attribute on mount
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    if (language === 'ar') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
