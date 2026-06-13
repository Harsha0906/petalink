import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Home } from './pages/Home.tsx';
import { Select } from './pages/Select.tsx';
import { Arrange } from './pages/Arrange.tsx';
import { Personalize } from './pages/Personalize.tsx';
import { Share } from './pages/Share.tsx';
import { Recipient } from './pages/Recipient.tsx';

const MainAppContent: React.FC = () => {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'home':
      return <Home />;
    case 'select':
      return <Select />;
    case 'arrange':
      return <Arrange />;
    case 'personalize':
      return <Personalize />;
    case 'share':
      return <Share />;
    case 'recipient':
      return <Recipient />;
    default:
      return <Home />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
};

export default App;
