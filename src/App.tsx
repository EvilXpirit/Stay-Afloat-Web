import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { SplashScreen } from './components/common/CommonComp';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HashRouter>
      {showSplash ? <SplashScreen /> : <MainLayout />}
    </HashRouter>
  );
};

export default App;