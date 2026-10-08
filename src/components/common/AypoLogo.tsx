import React from 'react';
import { Activity } from 'lucide-react';

interface AypoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark'; // light background means dark logo, dark background means light logo
  hideTextOnMobile?: boolean;
  hideTextAlways?: boolean;
}

export const AypoLogo: React.FC<AypoLogoProps> = ({ 
  className = '', 
  size = 'md', 
  theme = 'light',
  hideTextOnMobile = false,
  hideTextAlways = false
}) => {
  // Size mappings
  const boxSize = size === 'lg' ? 'w-12 h-12 rounded-2xl' : size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 rounded-xl';
  const iconSize = size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-xl';
  
  // Theme mappings
  const boxColors = theme === 'dark' ? 'bg-white text-gray-900 shadow-xl' : 'bg-gray-900 text-white shadow-md';
  const textColors = theme === 'dark' ? 'text-white' : 'text-gray-900';

  // Text visibility
  const textDisplay = hideTextAlways ? 'hidden' : hideTextOnMobile ? 'hidden lg:block' : 'block';

  return (
    <div className={`flex items-center gap-3 flex-shrink-0 cursor-pointer ${className}`}>
      <div className={`${boxSize} ${boxColors} flex items-center justify-center transition-transform hover:scale-105`}>
         <Activity className={iconSize} />
      </div>
      <span className={`${textSize} font-extrabold tracking-tight ${textColors} ${textDisplay}`}>
        AYPO
      </span>
    </div>
  );
};
