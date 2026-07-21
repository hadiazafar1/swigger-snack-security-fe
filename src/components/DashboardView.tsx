import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SnackCategory } from '../types';

export const DashboardView: React.FC = () => {
  const {
    snacks,
    canRestock,
    serverError,
    openConsumeModal,
    openRestockModal,
    refreshSnackList
  } = useApp();

  useEffect(() => {
    refreshSnackList();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: string[] = ['ALL', 'Fruit', 'Coffee', 'Doughnut', 'Other'];

  const filteredSnacks = snacks.filter((s) => {
    return selectedCategory === 'ALL' ? true : s.category === selectedCategory;
  });

  const getCategoryBadge = (category: SnackCategory) => {
    switch (category) {
      case 'Fruit':
        return (
          <span className="text-[10px] font-black uppercase text-on-tertiary-container bg-tertiary-fixed px-2.5 py-0.5 rounded-full inline-block">
            Fruit
          </span>
        );
      case 'Coffee':
        return (
          <span className="text-[10px] font-black uppercase text-on-primary-fixed-variant bg-primary-fixed px-2.5 py-0.5 rounded-full inline-block">
            Coffee
          </span>
        );
      case 'Doughnut':
        return (
          <span className="text-[10px] font-black uppercase text-on-secondary-fixed-variant bg-secondary-fixed px-2.5 py-0.5 rounded-full inline-block">
            Doughnut
          </span>
        );
      case 'Other':
      default:
        return (
          <span className="text-[10px] font-black uppercase text-on-surface-variant bg-surface-variant px-2.5 py-0.5 rounded-full inline-block">
            {category}
          </span>
        );
    }
  };

  return (
    <main className="main-content lg:ml-[240px] pt-24 pb-32 px-lg min-h-screen">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-outline-variant/60 pb-5">
        <div>
          <h1 className="font-display-md text-display-md font-bold text-primary tracking-tight">
            Snack Inventory
          </h1>
          <p className="text-on-surface-variant mt-1 font-body-md">
            Available Snacks and real-time stock levels.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 items-center bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-label-md font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid of Snacks */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSnacks.map((snack) => {
          const minQty = snack.minQuantity ?? 0;
          const isOutOfStock = snack.currentStock === 0;
          const isLowStock = !isOutOfStock && snack.currentStock < minQty;
          const progressPct = Math.min(
            100,
            Math.max(0, Math.round((snack.currentStock / snack.maxCapacity) * 100))
          );

          return (
            <div
              key={snack.id}
              className={`bg-surface-container-lowest border rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all relative shadow-xs hover:shadow-md ${
                isOutOfStock
                  ? 'border-error/40 bg-error-container/5'
                  : isLowStock
                  ? 'border-secondary/50'
                  : 'border-outline-variant/80'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>{getCategoryBadge(snack.category)}</div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-1.5">
                    {isOutOfStock && (
                      <span className="bg-error text-on-error text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">error</span>
                        Out of Stock
                      </span>
                    )}
                    {isLowStock && (
                      <span className="bg-secondary text-on-secondary text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">warning</span>
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Snack Name */}
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary pt-1">
                  {snack.name}
                </h3>
              </div>

              {/* Inventory Details Grid */}
              <div className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/40 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant block">
                      Current Quantity
                    </span>
                    <span
                      className={`text-headline-sm font-bold ${
                        isOutOfStock ? 'text-error' : isLowStock ? 'text-secondary' : 'text-primary'
                      }`}
                    >
                      {snack.currentStock}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant block">
                      Minimum Quantity
                    </span>
                    <span className="text-headline-sm font-bold text-on-surface-variant">
                      {minQty}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant block">
                      Maximum Quantity
                    </span>
                    <span className="text-headline-sm font-bold text-primary">
                      {snack.maxCapacity}
                    </span>
                  </div>
                </div>

                {/* Stock Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className="text-on-surface-variant uppercase tracking-wider">
                      Stock Level
                    </span>
                    <span
                      className={
                        isOutOfStock ? 'text-error' : isLowStock ? 'text-secondary' : 'text-primary'
                      }
                    >
                      {progressPct}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isOutOfStock
                          ? 'bg-error'
                          : isLowStock
                          ? 'bg-secondary'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => openConsumeModal(snack.id)}
                  disabled={isOutOfStock}
                  className="flex-1 py-2.5 bg-primary text-on-primary text-label-md font-bold rounded-lg transition-all active:scale-95 hover:bg-primary-container cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">restaurant</span>
                  <span>Consume</span>
                </button>

                {canRestock && (
                  <button
                    onClick={() => openRestockModal(snack.id)}
                    className="flex-1 py-2.5 border border-outline-variant text-primary hover:bg-surface-variant text-label-md font-bold rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                    <span>Restock</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {filteredSnacks.length === 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl py-16 px-6 text-center shadow-xs">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-3">
            {serverError ? 'cloud_off' : 'inventory_2'}
          </span>
          <h2 className="text-headline-sm font-bold text-primary">
            {serverError ? 'Unable to load snack inventory' : 'No snacks available'}
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1 mb-4">
            {serverError ? 'Check that the API is running, then try again.' : 'There are no snacks in this category.'}
          </p>
          <button onClick={() => void refreshSnackList()} className="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold cursor-pointer">
            Try again
          </button>
        </div>
      )}
    </main>
  );
};
