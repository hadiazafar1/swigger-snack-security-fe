import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { LogAction } from '../types';

const timestampFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : timestampFormatter.format(date);
};

export const ActivityLogView: React.FC = () => {
  const { logs, logPagination, refreshLogs } = useApp();
  const [filterAction, setFilterAction] = useState<'All' | 'Consume' | 'Restock'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef<HTMLElement>(null);
  const pageSize = 10;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    Promise.resolve(refreshLogs(currentPage - 1, pageSize, filterAction))
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [currentPage, filterAction]);

  // Keep the view restricted to the supported activity types.
  const filteredLogs = logs.filter((log) => {
    if (log.action !== 'Consume' && log.action !== 'Restock') {
      return false;
    }

    return filterAction === 'All' || log.action === filterAction;
  });

  const totalPages = Math.max(1, logPagination.totalPages);
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedLogs = filteredLogs;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const goToPage = (pageNumber: number) => {
    const nextPage = Math.max(1, Math.min(totalPages, pageNumber));
    setCurrentPage(nextPage);
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="flex-1 lg:ml-[240px] pt-24 pb-32 px-lg bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-5">
          <div>
            <h1 className="font-display-md text-display-md font-bold text-primary tracking-tight">
              Activity Log
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Real-time records of snack consumption and restocking activities.
            </p>
          </div>

          {/* Action Filter Pills */}
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/50">
            <button
              onClick={() => {
                setFilterAction('All');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-label-md font-bold transition-all cursor-pointer ${
                filterAction === 'All'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilterAction('Consume');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-label-md font-bold transition-all cursor-pointer ${
                filterAction === 'Consume'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'
              }`}
            >
              Consume
            </button>
            <button
              onClick={() => {
                setFilterAction('Restock');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-label-md font-bold transition-all cursor-pointer ${
                filterAction === 'Restock'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'
              }`}
            >
              Restock
            </button>
          </div>
        </header>

        {/* Main Data Table Card */}
        <section ref={tableRef} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden flex flex-col shadow-xs scroll-mt-24">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/60">
                  <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">
                    User ID
                  </th>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">
                    Action
                  </th>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">
                    Snack ID
                  </th>
                  <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-[11px] font-bold text-right">
                    Quantity
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-outline-variant/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center bg-surface-container-lowest">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="spinner !w-8 !h-8 !border-primary"></div>
                        <span className="font-body-md text-on-surface-variant font-medium">
                          Loading activity logs...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center bg-surface-container-lowest">
                      <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-on-surface-variant text-[32px]">
                          history_toggle_off
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-primary font-bold mb-1">
                        No activity logs found
                      </h3>
                      <p className="font-body-md text-on-surface-variant mb-4 max-w-sm mx-auto">
                        There aren't any activities matching the selected action filter.
                      </p>
                      {filterAction !== 'All' && (
                        <button
                          onClick={() => {
                            setFilterAction('All');
                            setCurrentPage(1);
                          }}
                          className="font-label-md text-primary border border-outline-variant px-4 py-2 rounded-lg hover:bg-surface-variant transition-all cursor-pointer font-bold"
                        >
                          Clear all filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log, index) => (
                    <tr
                      key={log.id || `log-${index}-${log.timestamp}`}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      {/* Timestamp */}
                      <td
                        className="px-6 py-4 font-body-sm text-on-surface font-medium whitespace-nowrap"
                        title={log.timestamp}
                      >
                        {formatTimestamp(log.timestamp)}
                      </td>

                      {/* User ID - strictly plain text without initials avatar */}
                      <td className="px-6 py-4 font-body-md font-semibold text-primary whitespace-nowrap">
                        {log.userId}
                      </td>

                      {/* Action - Consume or Restock badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.action === 'Consume' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-secondary-container text-on-secondary-container">
                            <span className="material-symbols-outlined text-[14px] mr-1">restaurant</span>
                            Consume
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-tertiary-container text-on-tertiary-container">
                            <span className="material-symbols-outlined text-[14px] mr-1">inventory_2</span>
                            Restock
                          </span>
                        )}
                      </td>

                      {/* Snack ID - strictly only Snack ID, no name beside it */}
                      <td className="px-6 py-4 font-body-md text-on-surface-variant font-mono whitespace-nowrap">
                        {log.snackId}
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4 font-body-md text-right font-bold whitespace-nowrap">
                        {log.quantity > 0 ? (
                          <span className="text-tertiary">+{log.quantity}</span>
                        ) : (
                          <span className="text-primary">{log.quantity}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {!isLoading && filteredLogs.length > 0 && (
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-label-md text-on-surface-variant text-body-sm">
                Showing{' '}
                <span className="font-bold text-primary">
                  {startIndex + 1}
                </span>{' '}
                to{' '}
                <span className="font-bold text-primary">
                  {Math.min(startIndex + logs.length, logPagination.totalElements)}
                </span>{' '}
                of <span className="font-bold text-primary">{logPagination.totalElements}</span> entries
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activePage === 1}
                  onClick={() => goToPage(activePage - 1)}
                  className="p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Previous page"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    // Only show first page, last page, and pages around activePage if totalPages > 5
                    if (
                      totalPages <= 5 ||
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - activePage) <= 1
                    ) {
                      return (
                        <button
                          type="button"
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          aria-label={`Go to page ${pageNum}`}
                          aria-current={activePage === pageNum ? 'page' : undefined}
                          className={`w-8 h-8 rounded-lg font-label-md font-bold cursor-pointer transition-all ${
                            activePage === pageNum
                              ? 'bg-primary text-on-primary shadow-xs'
                              : 'bg-surface-container-lowest hover:bg-surface-variant border border-outline-variant/50 text-on-surface-variant'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (
                      (pageNum === 2 && activePage > 3) ||
                      (pageNum === totalPages - 1 && activePage < totalPages - 2)
                    ) {
                      return (
                        <span key={pageNum} className="w-6 h-8 flex items-center justify-center text-on-surface-variant text-xs">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  disabled={activePage >= totalPages}
                  onClick={() => goToPage(activePage + 1)}
                  className="p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Next page"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
