import React from 'react';
import { Heart } from 'lucide-react';
const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-medical-red heartbeat" />
          <h1 className="text-xl font-bold text-medical-darkBlue">CardioDetect AI</h1>
        </div>
        <nav>
        </nav>
      </div>
    </header>
  );
};
export default Header;