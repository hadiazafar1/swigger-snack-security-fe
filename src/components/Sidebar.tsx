import React from 'react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { page, setPage, logout } = useApp();

  if (page === 'login') return null;

  return (
    <aside className="bg-surface-container-low border-r border-outline-variant fixed left-0 top-0 h-full w-[240px] hidden lg:flex flex-col p-md gap-sm z-30 pt-20">
      <div className="mb-lg px-2">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
          </div>
          <div>
            <h1 className="font-display-md text-[18px] font-bold text-primary leading-tight">
              Snack Inventory
            </h1>
            <p className="font-label-md text-label-sm text-on-surface-variant opacity-70">
              Inventory System
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <button
          onClick={() => setPage('dashboard')}
          className={`w-full flex items-center gap-md px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 text-left cursor-pointer ${
            page === 'dashboard'
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-md">Dashboard</span>
        </button>

        <button
          onClick={() => setPage('activity-log')}
          className={`w-full flex items-center gap-md px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 text-left cursor-pointer ${
            page === 'activity-log'
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-label-md">Activity Log</span>
        </button>
      </nav>

      <div className="mt-auto border-t border-outline-variant pt-4 space-y-1">
        <button
          onClick={logout}
          className="w-full flex items-center gap-md px-3 py-2 text-error hover:bg-error-container/30 rounded-lg transition-all duration-200 active:scale-95 text-left cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md">Logout</span>
        </button>
      </div>
    </aside>
  );
};
