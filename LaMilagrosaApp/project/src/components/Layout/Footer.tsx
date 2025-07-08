import React from 'react';
import { Heart, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-red-800 to-red-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">&copy; {new Date().getFullYear()} LaMilagrosaApp. Todos los derechos reservados.</p>

        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <a href="https://github.com/dfmarinl/LaMilagrosaApp" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 flex items-center space-x-1">
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <span className="flex items-center space-x-1">
            
            <span>Hecho por Reflex Labs Software Consulting S.A.S </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
