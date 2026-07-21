import React from 'react';
import { useApp } from '../context/AppContext';

export const TopNavbar: React.FC = () => {
  const { page, user, logout } = useApp();

  if (page === 'login') return null;

  return (
    <nav className="bg-surface border-b border-outline-variant fixed top-0 w-full z-40 flex justify-between items-center px-lg h-16">
      <div className="flex items-center gap-md">
        <span className="text-headline-sm font-black text-primary tracking-tight">
          Snack Inventory
        </span>
      </div>

      <div className="flex items-center gap-md">
        {user && (
          <div className="flex items-center gap-sm">
            <div className="text-right hidden sm:block">
              <p className="font-label-md text-label-md leading-none text-primary font-bold">
                {user.name}
              </p>
              <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] uppercase font-black px-1.5 py-0.5 rounded-sm inline-block mt-1">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-on-surface-variant hover:text-error hover:bg-surface-container-low transition-colors rounded-full cursor-pointer"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
