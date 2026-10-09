import React, { useEffect } from 'react';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  useEffect(() => {
    // Only load the script if it hasn't been loaded
    if (!document.getElementById('google-translate-script')) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google?.translate?.TranslateElement) {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'ta,te,hi,ml,kn,mr,bn,gu,pa,or,ur,en',
            // Omit 'layout' to force a standard <select> box which we can style via CSS
            autoDisplay: false
          }, 'google_translate_element');
        }
      };
      
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="fixed bottom-28 right-6 z-[9999] p-3.5 bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col gap-2 min-w-[200px]">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600">
          <Globe className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800 leading-tight">Translate App</span>
          <span className="text-[9px] text-slate-500 font-medium">Select regional language</span>
        </div>
      </div>
      <div id="google_translate_element" className="w-full mt-1 translate-widget-container"></div>
    </div>
  );
};
