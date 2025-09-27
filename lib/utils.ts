import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Date formatting
export function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
}

// SLA countdown helpers
export function getSLACountdown(targetDate: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  isOverdue: boolean;
} {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  
  const isOverdue = diff < 0;
  const absDiff = Math.abs(diff);
  
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, isOverdue };
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  return Math.round((value / total) * 100);
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{5})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

// Get rating color
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-yellow-600';
  return 'text-red-600';
}

// Get status color
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'Intake': 'text-blue-600 bg-blue-50',
    'TeleConsult': 'text-purple-600 bg-purple-50',
    'Deposit': 'text-yellow-600 bg-yellow-50',
    'Visa': 'text-indigo-600 bg-indigo-50',
    'Admit': 'text-orange-600 bg-orange-50',
    'Surgery': 'text-red-600 bg-red-50',
    'Rehab': 'text-green-600 bg-green-50'
  };
  
  return statusColors[status] || 'text-slate-700 bg-slate-100';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'active':
      return '🟢'
    case 'completed':
      return '✅'
    case 'consulting':
      return '🟡'
    default:
      return '⚪'
  }
}

export const nowISO = () => new Date().toISOString();

export const DEFAULT_MILESTONES = [
  { name: "TeleConsult", pct: 10, released: false },
  { name: "Admission", pct: 40, released: false },
  { name: "Surgery", pct: 40, released: false },
  { name: "Discharge", pct: 10, released: false },
];
