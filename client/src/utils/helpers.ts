import { AxiosError } from 'axios';

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (date1: string | Date, date2: string | Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round((secondDate.getTime() - firstDate.getTime()) / oneDay);
};

/**
 * Check if book is overdue
 */
export const isOverdue = (dueDate: string | Date): boolean => {
  return new Date(dueDate) < new Date();
};

/**
 * Get days remaining or overdue
 */
export const getDaysRemaining = (dueDate: string | Date): string => {
  const today = new Date();
  const due = new Date(dueDate);
  const days = daysBetween(today, due);
  
  if (days < 0) {
    return `${Math.abs(days)} days overdue`;
  } else if (days === 0) {
    return 'Due today';
  } else {
    return `${days} days remaining`;
  }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string | undefined, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Get initials from name
 */
export const getInitials = (name: string | undefined): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Handle API error
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

