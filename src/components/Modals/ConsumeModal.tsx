import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const ConsumeModal: React.FC = () => {
  const {
    activeModal,
    selectedSnackId,
    snacks,
    closeModal,
    consumeSnack,
    showToast
  } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const snack = snacks.find((s) => s.id === selectedSnackId);

  useEffect(() => {
    if (activeModal === 'consume' && snack) {
      setQuantity(1);
      setErrorMsg(null);
      setIsLoading(false);
    }
  }, [activeModal, selectedSnackId, snack]);

  if (activeModal !== 'consume' || !snack) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (quantity <= 0) {
      setErrorMsg('Quantity must be greater than zero.');
      return;
    }

    if (quantity > snack.currentStock) {
      setErrorMsg(`Cannot consume more than available stock (${snack.currentStock} units).`);
      return;
    }

    setIsLoading(true);

    try {
      const result = await consumeSnack(snack.id, quantity);
      if (!result.success) throw new Error(result.error);
      showToast(`Successfully consumed ${quantity} unit(s) of ${snack.name}`, 'success');
      closeModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while consuming the snack.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-md animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-2xl border border-outline-variant">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">restaurant</span>
            </div>
            <h3 className="font-display-md text-display-md font-bold text-primary">
              Consume Snack
            </h3>
          </div>
          <button
            onClick={closeModal}
            disabled={isLoading}
            className="text-on-surface-variant hover:text-primary p-1 rounded-full cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-body-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase text-on-surface-variant block">Snack Name</span>
              <span className="font-headline-sm font-bold text-primary">{snack.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant block">Current Quantity</span>
              <span className="text-headline-sm font-bold text-primary">{snack.currentStock} units</span>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md font-bold text-primary mb-1">
              Quantity to Consume
            </label>
            <input
              type="number"
              min={1}
              max={snack.currentStock}
              value={quantity}
              onChange={(e) => {
                setErrorMsg(null);
                setQuantity(Number(e.target.value));
              }}
              className="w-full rounded-lg border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary p-3 text-body-md border font-bold"
              required
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-outline-variant/50">
            <button
              type="button"
              onClick={closeModal}
              disabled={isLoading}
              className="flex-1 py-2.5 border border-outline-variant text-primary font-bold rounded-lg hover:bg-surface-variant cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || snack.currentStock <= 0}
              className="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Consume</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
