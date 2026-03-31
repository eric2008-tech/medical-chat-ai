// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          © {currentYear} Copyright AKPAMAGBO Eric. Tous droits réservés.
        </p>
        <p className="text-xs mt-2 text-gray-500">
          Medichat ✦ Groq IA • Assistant Médical Bénin
        </p>
      </div>
    </footer>
  );
};

export default Footer;