import React from 'react';
import { ThemeType } from '../types';

interface ThemeCardProps {
  theme: ThemeType;
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  description: string;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isSelected, onClick, icon, description }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group flex flex-col items-start p-5 rounded-2xl text-left transition-all duration-300 border
        ${isSelected 
          ? 'bg-indigo-600 border-indigo-500 shadow-indigo-500/30 shadow-lg scale-[1.02]' 
          : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750'
        }
      `}
    >
      <div className={`
        mb-3 p-3 rounded-xl transition-colors
        ${isSelected ? 'bg-indigo-500/30 text-white' : 'bg-slate-700/50 text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-700'}
      `}>
        {icon}
      </div>
      <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
        {theme.split('/')[0]}
      </h3>
      <p className={`text-sm leading-snug ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
        {description}
      </p>
    </button>
  );
};
