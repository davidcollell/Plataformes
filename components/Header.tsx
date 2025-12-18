import React from 'react';
import { AppLogoIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 sm:p-6 border-b border-gray-800">
      <div className="flex items-center justify-center gap-4 mb-2">
        <AppLogoIcon className="h-10 w-10 sm:h-12 sm:w-12 shadow-lg rounded-2xl" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
          Control de Sèries i Pel·lícules
        </h1>
      </div>
      <p className="text-brand-text-muted text-sm sm:text-base">
        No oblidis mai més una recomanació de pel·lícula o sèrie.
      </p>
    </header>
  );
};

export default Header;