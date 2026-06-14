export type MenuCategory =
  | 'BURGERS'
  | 'LOADED_FRIES'
  | 'SIDES'
  | 'MILKSHAKES'
  | 'SODAS'
  | 'SAUCES';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string | null;
  isPopular: boolean;
  isNew: boolean;
  isSpicy: boolean;
  isVeg: boolean;
  available: boolean;
  order: number;
  calories: number | null;
  createdAt: string;
  updatedAt?: string;
}

export interface MenuGroup {
  category: MenuCategory;
  items: MenuItem[];
}

export interface MenuResponse {
  categories: MenuGroup[];
  total: number;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string | null;
  status: ReservationStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardData {
  stats: {
    todaysReservations: number;
    pendingReservations: number;
    confirmedReservations: number;
    unreadMessages: number;
    totalMenuItems: number;
    availableMenuItems: number;
  };
  upcoming: Reservation[];
}

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  BURGERS: 'Burgers',
  LOADED_FRIES: 'Loaded Fries',
  SIDES: 'Sides',
  MILKSHAKES: 'Milkshakes',
  SODAS: 'Sodas',
  SAUCES: 'Sauces',
};
