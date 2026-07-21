import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const RestockModal: React.FC = () => {
  const {
    activeModal,
    selectedSnackId,
    snacks,
    closeModal,
    restockSnack,
    showToast
  } = useApp();

  const [addedQty, setAddedQty] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const snack = snacks.find((s) => s.id === selectedSnackId);

  // Reset state on modal open
  useEffect(() => {
    if (activeModal === 'restock' && snack) {
      const defaultFill = Math.max(1, snack.maxCapacity - snack.currentStock);
      setAddedQty(defaultFill > 0 ? defaultFill : 1);
      setErrorMsg(null);
      setIsLoading(false);
    }
  }, [activeModal, selectedSnackId, snack]);

  if (activeModal !== 'restock' || !snack) return null;

  const minQty = snack.minQuantity ?? Math.max(1, Math.ceil(snack.maxCapacity * 0.2));
  const maxAllowed = Math.max(0, snack.maxCapacity - snack.currentStock);

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const numQty = typeof addedQty === 'number' ? addedQty : parseInt(String(addedQty), 10);

    // 1. Validate quantity > 0
    if (!numQty || isNaN(numQty) || numQty <= 0) {
      setErrorMsg('Quantity to Add must be greater than zero.');
      return;
    }

    // 2. Validate total quantity cannot exceed maximum capacity
    if (snack.currentStock + numQty > snack.maxCapacity) {
      setErrorMsg(
        `Total quantity (${snack.currentStock + numQty}) cannot exceed the maximum capacity of ${snack.maxCapacity} units. You can add at most ${maxAllowed} units.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await restockSnack(snack.id, numQty);
      if (!result.success) throw new Error(result.error);
      showToast(`Successfully restocked ${snack.name} (+${numQty} units)`, 'success');

      closeModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred while restocking.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-2xl border border-outline-variant flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            </div>
            <div>
              <h2 className="font-display-md text-display-md font-bold text-primary">
                Restock Snack
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Replenish inventory level for single snack
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            disabled={isLoading}
            className="text-on-surface-variant hover:text-primary hover:bg-surface-container p-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleRestock} className="mt-4 space-y-4">
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-body-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Snack Info Card */}
          <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-label-sm uppercase font-bold text-on-surface-variant text-[10px] tracking-wider block mb-0.5">
                  Snack Name
                </span>
                <span className="font-headline-sm font-bold text-primary">{snack.name}</span>
              </div>
              <div className="text-right">
                <span className="text-label-sm uppercase font-bold text-on-surface-variant text-[10px] tracking-wider block mb-0.5">
                  Snack Type
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-bold text-body-sm">
                  {snack.category}
                </span>
              </div>
            </div>

            {/* Quantities Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/30 text-center">
              <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant block">
                  Current Quantity
                </span>
                <span className="text-headline-sm font-bold text-primary">
                  {snack.currentStock}
                </span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant block">
                  Minimum Quantity
                </span>
                <span className="text-headline-sm font-bold text-secondary">
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
          </div>

          {/* Quantity to Add Input */}
          <div>
            <label className="block font-label-md text-label-md font-bold text-primary mb-1">
              Quantity to Add
            </label>
            <input
              type="number"
              min={1}
              max={maxAllowed}
              value={addedQty}
              onChange={(e) => {
                setErrorMsg(null);
                const val = e.target.value;
                setAddedQty(val === '' ? '' : parseInt(val, 10));
              }}
              placeholder="e.g. 10"
              className="w-full rounded-lg border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary p-3 text-body-md border bg-white font-bold"
              required
            />
            {/* Helper Text */}
            <p className="text-[12px] text-on-surface-variant mt-1.5 leading-tight">
              Total quantity cannot exceed the maximum quantity ({snack.maxCapacity} units).
              {maxAllowed > 0 ? (
                <span className="block mt-0.5 font-medium text-secondary">
                  You can add up to {maxAllowed} units to reach full capacity.
                </span>
              ) : (
                <span className="block mt-0.5 font-bold text-error">
                  This snack is already at maximum capacity ({snack.maxCapacity}).
                </span>
              )}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-3 border-t border-outline-variant/50">
            <button
              type="button"
              onClick={closeModal}
              disabled={isLoading}
              className="flex-1 py-2.5 border border-outline-variant text-primary font-bold rounded-lg hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (typeof addedQty === 'number' && addedQty <= 0)}
              className="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Restocking...</span>
                </>
              ) : (
                <span>Restock</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
