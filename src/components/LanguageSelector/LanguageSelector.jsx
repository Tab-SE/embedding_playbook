"use client";

import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSelector = () => {
  const {
    language,
    setLanguage,
    showLanguageDropdown,
    setShowLanguageDropdown
  } = useLanguage();

  return (
    <div className="relative language-selector">
      <button
        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {language === 'en' && '🇺🇸 English'}
          {language === 'es' && '🇪🇸 Español'}
          {language === 'fr' && '🇫🇷 Français'}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {showLanguageDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
          <div className="py-1">
            <button
              onClick={() => {
                setLanguage('en');
                setShowLanguageDropdown(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors flex items-center gap-3 ${
                language === 'en' ? 'bg-slate-700 text-white' : 'text-slate-300'
              }`}
            >
              <span className="text-lg">🇺🇸</span>
              <span>English</span>
            </button>
            <button
              onClick={() => {
                setLanguage('es');
                setShowLanguageDropdown(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors flex items-center gap-3 ${
                language === 'es' ? 'bg-slate-700 text-white' : 'text-slate-300'
              }`}
            >
              <span className="text-lg">🇪🇸</span>
              <span>Español</span>
            </button>
            <button
              onClick={() => {
                setLanguage('fr');
                setShowLanguageDropdown(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors flex items-center gap-3 ${
                language === 'fr' ? 'bg-slate-700 text-white' : 'text-slate-300'
              }`}
            >
              <span className="text-lg">🇫🇷</span>
              <span>Français</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
