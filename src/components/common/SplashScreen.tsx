import React from 'react';
import { Leaf } from 'lucide-react';

export const SplashScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EFE6] text-[#2F4F4F] animate-pulse">
    <Leaf className="w-24 h-24 text-[#4DB6AC]"/>
    <h1 className="text-6xl font-bold mt-4">StayAfloat</h1>
  </div>
);

export default SplashScreen;