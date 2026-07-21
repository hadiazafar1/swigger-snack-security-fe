import React from 'react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { page, setPage } = useApp();

  if (page === 'login') return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full flex lg:hidden justify-around items-center px-4 py-2 bg-surface border-t border-outline-variant shadow-sm z-50">
      <button
        onClick={() => setPage('dashboard')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer ${
          page === 'dashboard'
            ? 'bg-secondary-container text-on-secondary-container px-3'
            : 'text-on-surface-variant hover:bg-surface-variant'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">home</span>
        <span className="font-label-sm text-[10px]">Dashboard</span>
      </button>

      <button
        onClick={() => setPage('activity-log')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer ${
          page === 'activity-log'
            ? 'bg-secondary-container text-on-secondary-container px-3'
            : 'text-on-surface-variant hover:bg-surface-variant'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">history</span>
        <span className="font-label-sm text-[10px]">Logs</span>
      </button>
    </nav>
  );
};
