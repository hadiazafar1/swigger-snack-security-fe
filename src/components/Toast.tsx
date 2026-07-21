import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border font-label-md text-body-sm font-bold ${
          isSuccess
            ? 'bg-primary text-on-primary border-tertiary-fixed'
            : 'bg-error text-on-error border-error-container'
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] ${isSuccess ? 'text-tertiary-fixed' : 'text-on-error'}`}>
          {isSuccess ? 'check_circle' : 'error'}
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
