import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 overflow-hidden"
      role="switch"
      aria-checked={currentLanguage === 'es'}
      aria-label={`Switch to ${currentLanguage === 'en' ? 'Spanish' : 'English'}`}
    >
      {/* EN text - always at left */}
      <span className="absolute left-2 text-xs font-medium text-gray-600 dark:text-gray-400 z-0">
        EN
      </span>
      
      {/* ES text - always at right */}
      <span className="absolute right-2 text-xs font-medium text-gray-600 dark:text-gray-400 z-0">
        ES
      </span>
      
      {/* Sliding indicator that covers/reveals text */}
      <span
        className={`absolute inline-block h-6 w-8 transform rounded-full bg-primary-600 transition-transform shadow-sm z-10 flex items-center justify-center ${
          currentLanguage === 'es' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        <span className="text-xs font-medium text-white">
          {currentLanguage === 'en' ? 'EN' : 'ES'}
        </span>
      </span>
    </button>
  );
};

export default LanguageSelector;