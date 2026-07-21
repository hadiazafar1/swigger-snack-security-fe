import { SnackAsset, ActivityLog, UserProfile, NotificationItem } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'alex',
  name: 'Alex "Admin" Thorne',
  role: 'ELDER',
  email: 'alex.thorne@swiggersecurity.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZVTNEgsP9BiwKxxJgllTXmeqAbtvUBpps3K4lq4GqNiAnqzI5PRLtEMkPY_ulWo4hO66nsbl7hWHlwto1IFjudETInePo1ExDXyROFuM7xULseQUowFRgoHgsdir3SgThXgJeXlYyvVD4CgXPiWqiHRC2RaWu8rXB2beABykmXSC5klCRR__7OETxIXScJ2u1-TQuPCqIZT3BOwwzMmM_bR85S3WbrvM8Q2FiRwl794U9p1aK9ZJgXnhaJmWnPLrvMB_VESeZgvDp'
};

export const INITIAL_SNACKS: SnackAsset[] = [
  {
    id: 'snack-001',
    name: 'Apple',
    category: 'Fruit',
    currentStock: 42,
    minQuantity: 10,
    maxCapacity: 50,
    status: 'HEALTHY',
    icon: 'nutrition',
    location: 'Station A',
    lastRestocked: '2023-10-24 08:30'
  },
  {
    id: 'snack-002',
    name: 'Banana',
    category: 'Fruit',
    currentStock: 4,
    minQuantity: 10,
    maxCapacity: 30,
    status: 'LOW_STOCK',
    icon: 'nutrition',
    location: 'Station A',
    lastRestocked: '2023-10-23 14:00'
  },
  {
    id: 'snack-003',
    name: 'Cappuccino',
    category: 'Coffee',
    currentStock: 25,
    minQuantity: 15,
    maxCapacity: 60,
    status: 'HEALTHY',
    icon: 'coffee',
    location: 'Lounge C',
    lastRestocked: '2023-10-24 09:41'
  },
  {
    id: 'snack-004',
    name: 'Espresso Shot',
    category: 'Coffee',
    currentStock: 0,
    minQuantity: 20,
    maxCapacity: 100,
    status: 'OUT_OF_STOCK',
    icon: 'coffee',
    location: 'Lounge C',
    lastRestocked: '2023-10-22 10:15'
  },
  {
    id: 'snack-005',
    name: 'Glazed Doughnut',
    category: 'Doughnut',
    currentStock: 3,
    minQuantity: 8,
    maxCapacity: 24,
    status: 'LOW_STOCK',
    icon: 'cookie',
    location: 'Station B',
    lastRestocked: '2023-10-23 18:30'
  },
  {
    id: 'snack-006',
    name: 'Chocolate Doughnut',
    category: 'Doughnut',
    currentStock: 18,
    minQuantity: 8,
    maxCapacity: 24,
    status: 'HEALTHY',
    icon: 'cookie',
    location: 'Station B',
    lastRestocked: '2023-10-24 11:00'
  },
  {
    id: 'snack-007',
    name: 'Tea Biscuits',
    category: 'Other',
    currentStock: 35,
    minQuantity: 12,
    maxCapacity: 50,
    status: 'HEALTHY',
    icon: 'bakery_dining',
    location: 'Pantry E',
    lastRestocked: '2023-10-24 07:00'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2023-10-24 14:22:15',
    userId: 'USR-40291',
    action: 'Consume',
    snackId: 'snack-005',
    quantity: -2
  },
  {
    id: 'LOG-002',
    timestamp: '2023-10-24 13:05:01',
    userId: 'ADM-002',
    action: 'Restock',
    snackId: 'snack-007',
    quantity: 24
  },
  {
    id: 'LOG-003',
    timestamp: '2023-10-24 12:30:12',
    userId: 'USR-11029',
    action: 'Consume',
    snackId: 'snack-001',
    quantity: -1
  },
  {
    id: 'LOG-004',
    timestamp: '2023-10-24 11:45:33',
    userId: 'USR-88219',
    action: 'Consume',
    snackId: 'snack-003',
    quantity: -1
  },
  {
    id: 'LOG-006',
    timestamp: '2023-10-24 09:41:10',
    userId: 'ADM-001',
    action: 'Restock',
    snackId: 'snack-003',
    quantity: 50
  },
  {
    id: 'LOG-007',
    timestamp: '2023-10-24 08:15:22',
    userId: 'USR-40291',
    action: 'Consume',
    snackId: 'snack-002',
    quantity: -3
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'Low Stock Alert',
    message: 'Glazed Doughnut (SNK-B-883) stock level critical (3/24 remaining).',
    time: '10 mins ago',
    read: false,
    type: 'warning'
  },
  {
    id: 'NOTIF-2',
    title: 'Critical Failure',
    message: 'Avocado Toast (SNK-D-092) is completely out of stock.',
    time: '1 hour ago',
    read: false,
    type: 'error'
  },
  {
    id: 'NOTIF-3',
    title: 'Sync Connection Degraded',
    message: 'Real-time telemetry cache engaged. Retrying background daemon...',
    time: '2 hours ago',
    read: true,
    type: 'info'
  }
];
