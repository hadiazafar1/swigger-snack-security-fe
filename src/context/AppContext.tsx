import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityLog, NotificationItem, Page, SnackAsset, SnackCategory, UserProfile } from '../types';

const TOKEN_KEY = 'snack_security_token';
const USER_KEY = 'snack_security_user';

type ActionResult = { success: boolean; error?: string };

interface AppContextType {
  page: Page;
  setPage: (page: Page) => void;
  user: UserProfile | null;
  canRestock: boolean;
  login: (email: string, pass: string) => Promise<ActionResult>;
  logout: () => void;
  snacks: SnackAsset[];
  logs: ActivityLog[];
  logPagination: { page: number; size: number; totalElements: number; totalPages: number };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  serverError: boolean;
  setServerError: (error: boolean) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
  refreshSnackList: () => Promise<void>;
  refreshLogs: (page?: number, size?: number, action?: 'Consume' | 'Restock' | 'All') => Promise<void>;
  activeModal: 'consume' | 'restock' | null;
  selectedSnackId: string | null;
  openConsumeModal: (snackId: string) => void;
  openRestockModal: (snackId: string) => void;
  closeModal: () => void;
  consumeSnack: (snackId: string, quantity: number) => Promise<ActionResult>;
  restockSnack: (snackId: string, quantity: number) => Promise<ActionResult>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const pageFromPath = (): Page => {
  const path = window.location.pathname.toLowerCase();
  if (path === '/login') return 'login';
  if (path === '/activity' || path === '/activity-log') return 'activity-log';
  return 'dashboard';
};

const pathFromPage = (page: Page) =>
  page === 'login' ? '/login' : page === 'activity-log' ? '/activity' : '/snacks';

const readStoredUser = (): UserProfile | null => {
  try {
    const stored = sessionStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const iconFor = (category: SnackCategory) =>
  category === 'Coffee' ? 'coffee' : category === 'Doughnut' ? 'cookie' : category === 'Other' ? 'bakery_dining' : 'nutrition';

const mapSnack = (snack: any): SnackAsset => ({
  id: snack.id,
  name: snack.name,
  category: snack.type as SnackCategory,
  currentStock: snack.quantity,
  minQuantity: snack.minQuantity,
  maxCapacity: snack.maxQuantity,
  status: snack.quantity === 0 ? 'OUT_OF_STOCK' : snack.lowStock ? 'LOW_STOCK' : 'HEALTHY',
  icon: iconFor(snack.type)
});

const apiMessage = async (response: Response, fallback: string) => {
  const body = await response.json().catch(() => null);
  return body?.message || body?.error || fallback;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialUser = readStoredUser();
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [page, setPageState] = useState<Page>(() => initialUser ? pageFromPath() : 'login');
  const [snacks, setSnacks] = useState<SnackAsset[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logPagination, setLogPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [serverError, setServerError] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeModal, setActiveModal] = useState<'consume' | 'restock' | null>(null);
  const [selectedSnackId, setSelectedSnackId] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const token = () => sessionStorage.getItem(TOKEN_KEY);
  const authHeaders = (json = false): HeadersInit => ({
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${token() || ''}`
  });

  const navigate = useCallback((nextPage: Page, replace = false) => {
    setPageState(nextPage);
    const path = pathFromPage(nextPage);
    if (window.location.pathname !== path) {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', path);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
    setSnacks([]);
    setLogs([]);
    setActiveModal(null);
    navigate('login', true);
  }, [navigate]);

  const authenticatedFetch = useCallback(async (url: string, init: RequestInit = {}) => {
    const response = await fetch(url, init);
    if (response.status === 401) logout();
    return response;
  }, [logout]);

  const setPage = (nextPage: Page) => {
    if (!user && nextPage !== 'login') return navigate('login');
    navigate(nextPage);
  };

  useEffect(() => {
    const onPopState = () => setPageState(user ? pageFromPath() : 'login');
    window.addEventListener('popstate', onPopState);
    if (!user && window.location.pathname !== '/login') navigate('login', true);
    return () => window.removeEventListener('popstate', onPopState);
  }, [navigate, user]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = window.setTimeout(() => setToast(null), 3500);
  };

  const refreshSnackList = useCallback(async () => {
    if (!token()) return;
    try {
      const response = await authenticatedFetch('/api/snacks', { headers: authHeaders() });
      if (!response.ok) throw new Error(await apiMessage(response, 'Unable to load snacks.'));
      const data = await response.json();
      const mapped: SnackAsset[] = data.map(mapSnack);
      setSnacks(mapped);
      setServerError(false);
    } catch (error) {
      setServerError(true);
      showToast(error instanceof Error ? error.message : 'Unable to connect to the API.', 'error');
    }
  }, [authenticatedFetch]);

  const refreshLogs = useCallback(async (page = 0, size = 10, action: 'Consume' | 'Restock' | 'All' = 'All') => {
    if (!token()) return;
    try {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (action !== 'All') params.set('action', action.toLowerCase());
      const response = await authenticatedFetch(`/api/consumption-logs?${params.toString()}`, { headers: authHeaders() });
      if (!response.ok) throw new Error(await apiMessage(response, 'Unable to load activity logs.'));
      const data = await response.json();
      const content = Array.isArray(data) ? data : data.content;
      setLogs((content || []).map((log: any) => ({
        id: log.id,
        timestamp: log.timestamp,
        userId: log.userId,
        action: String(log.action).toLowerCase() === 'restock' ? 'Restock' : 'Consume',
        snackId: log.snackId,
        quantity: log.quantity
      })));
      setLogPagination({
        page: data.page ?? page,
        size: data.size ?? size,
        totalElements: data.totalElements ?? content?.length ?? 0,
        totalPages: data.totalPages ?? (content?.length ? 1 : 0)
      });
      setServerError(false);
    } catch (error) {
      setServerError(true);
      showToast(error instanceof Error ? error.message : 'Unable to connect to the API.', 'error');
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (user && token()) void refreshSnackList();
  }, [user, refreshSnackList]);

  const login = async (email: string, pass: string): Promise<ActionResult> => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      if (!response.ok) return { success: false, error: await apiMessage(response, 'Invalid credentials.') };
      const data = await response.json();
      if (!data.accessToken || !data.user) return { success: false, error: 'The server returned an invalid login response.' };
      const profile: UserProfile = data.user;
      sessionStorage.setItem(TOKEN_KEY, data.accessToken);
      sessionStorage.setItem(USER_KEY, JSON.stringify(profile));
      setUser(profile);
      navigate('dashboard', true);
      return { success: true };
    } catch {
      return { success: false, error: 'Unable to reach the server. Make sure the API is running.' };
    }
  };

  const mutateSnack = async (snackId: string, quantity: number, action: 'consume' | 'restock'): Promise<ActionResult> => {
    try {
      const response = await authenticatedFetch(`/api/snacks/${encodeURIComponent(snackId)}/${action}`, {
        method: 'POST', headers: authHeaders(true), body: JSON.stringify({ quantity })
      });
      if (!response.ok) return { success: false, error: await apiMessage(response, `Unable to ${action} this snack.`) };
      const updatedSnack = mapSnack(await response.json());
      setSnacks(current => current.map(snack => snack.id === updatedSnack.id ? updatedSnack : snack));
      return { success: true };
    } catch {
      return { success: false, error: 'Unable to reach the server. Please try again.' };
    }
  };

  const closeModal = () => { setActiveModal(null); setSelectedSnackId(null); };
  const canRestock = user?.role === 'Elder' || user?.role === 'Culture';

  return <AppContext.Provider value={{
    page, setPage, user, canRestock, login, logout, snacks, logs, logPagination, searchQuery, setSearchQuery,
    serverError, setServerError, notifications, markNotificationRead: id => setNotifications(items => items.map(item => item.id === id ? { ...item, read: true } : item)),
    clearNotifications: () => setNotifications([]), toast, showToast, refreshSnackList, refreshLogs,
    activeModal, selectedSnackId,
    openConsumeModal: id => { setSelectedSnackId(id); setActiveModal('consume'); },
    openRestockModal: id => { if (canRestock) { setSelectedSnackId(id); setActiveModal('restock'); } },
    closeModal,
    consumeSnack: (id, quantity) => mutateSnack(id, quantity, 'consume'),
    restockSnack: (id, quantity) => mutateSnack(id, quantity, 'restock')
  }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
