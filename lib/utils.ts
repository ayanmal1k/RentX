import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely formats a date object, Firestore Timestamp, or date string.
 * @param date The date to format
 * @param formatStr The date-fns format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string or 'N/A'
 */
export function formatDate(date: any, formatStr: string = 'MMM dd, yyyy'): string {
  if (!date) return 'N/A';
  
  try {
    let d: Date;
    
    if (date instanceof Timestamp) {
      d = date.toDate();
    } else if (date instanceof Date) {
      d = date;
    } else if (typeof date === 'object' && date.seconds !== undefined) {
      // Handle cases where Timestamp is serialized as plain object
      d = new Date(date.seconds * 1000);
    } else {
      d = new Date(date);
    }
    
    // Check if date is valid
    if (isNaN(d.getTime())) return 'N/A';
    
    return format(d, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
}
