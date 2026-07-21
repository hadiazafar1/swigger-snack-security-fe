export type Page = 'dashboard' | 'activity-log' | 'login';

export type SnackCategory = 'Fruit' | 'Coffee' | 'Doughnut' | 'Other';

export type SnackStatus = 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL_FAILURE' | 'OUT_OF_STOCK';

export interface SnackAsset {
  id: string;
  name: string;
  category: SnackCategory;
  currentStock: number;
  minQuantity?: number;
  maxCapacity: number;
  status: SnackStatus;
  icon?: string;
  location?: string;
  lastRestocked?: string;
}

export type LogAction = 'Consume' | 'Restock';

export interface ActivityLog {
  id?: string;
  timestamp: string;
  userId: string;
  action: LogAction;
  snackId: string;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'warning' | 'info' | 'error' | 'success';
}
