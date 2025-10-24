import React from 'react';
import { BookOpenIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center">
          <BookOpenIcon className="w-8 h-8 text-cyan-400 mr-3"/>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            ScholarSight
          </h1>
        </div>
      </div>
    </header>
  );
};