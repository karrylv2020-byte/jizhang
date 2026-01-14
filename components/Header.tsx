import React from 'react';
import { Leaf, ScanLine } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-tr from-primary to-emerald-300 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Leaf size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            NutriScan AI
          </span>
        </div>
        
        <a href="#" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
            <ScanLine size={16}/>
            <span>新扫描</span>
        </a>
      </div>
    </header>
  );
};

export default Header;