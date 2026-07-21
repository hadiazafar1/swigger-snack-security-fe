import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { ActivityLogView } from './components/ActivityLogView';
import { LoginView } from './components/LoginView';

import { ConsumeModal } from './components/Modals/ConsumeModal';
import { RestockModal } from './components/Modals/RestockModal';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { page } = useApp();

  if (page === 'login') {
    return <LoginView />;
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md selection:bg-secondary-fixed">
      {/* Top Navbar */}
      <TopNavbar />

      <div className="flex flex-1 min-h-screen">
        {/* Left Fixed Sidebar */}
        <Sidebar />

        {/* Dynamic View Component */}
        {page === 'dashboard' && <DashboardView />}
        {page === 'activity-log' && <ActivityLogView />}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals & Toast */}
      <ConsumeModal />
      <RestockModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
