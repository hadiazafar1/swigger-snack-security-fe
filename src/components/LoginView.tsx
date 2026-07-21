import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid credentials');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="mesh-gradient min-h-screen flex items-center justify-center p-md relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div
            className="w-full h-full opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#807571 0.5px, transparent 0.5px)',
              backgroundSize: '24px 24px'
            }}
          ></div>
        </div>
      </div>

      {/* Main Content Card */}
      <main className="relative z-10 w-full max-w-[420px]">
        <div
          className={`bg-surface-container-lowest rounded-xl p-8 flex flex-col gap-lg shadow-md border border-outline-variant/60 ${
            shake ? 'animate-shake' : ''
          }`}
        >
          {/* Application Logo & Title */}
          <div className="flex flex-col items-center text-center gap-sm">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-xs shadow-xs">
              <span
                className="material-symbols-outlined text-on-primary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                inventory_2
              </span>
            </div>
            <h1 className="font-display-md text-display-md font-bold text-primary tracking-tight">
              Snack Inventory
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant px-2">
              Snack Inventory Management System
            </p>
          </div>

          {/* Invalid Credentials Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-sm bg-error-container text-on-error-container p-md rounded-lg border border-error/20 animate-in zoom-in-95 duration-200">
              <span className="material-symbols-outlined text-headline-sm flex-shrink-0">
                error
              </span>
              <span className="font-body-sm text-body-sm font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-md py-3 bg-surface-container-low border rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary transition-all ${
                    errorMessage ? 'border-error bg-error-container/5' : 'border-outline-variant'
                  }`}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Password */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 bg-surface-container-low border rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary transition-all ${
                    errorMessage ? 'border-error bg-error-container/5' : 'border-outline-variant'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-primary text-on-primary py-3.5 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-sm hover:bg-primary-container active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-sm">
                  <div className="spinner"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
