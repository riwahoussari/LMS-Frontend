import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const monthsMMM = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export function formatDate(date: string, format: "MMM DD") {
  if (format === "MMM DD") {
    const splitDate = date.split("-");
    const month = monthsMMM[parseInt(splitDate[1]) - 1];
    const day = splitDate[2];

    return `${month} ${day}`;
  }
}

export function getWeeksBetween(startDate: string, endDate: string): number {
  // Parse the date strings into Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate the dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format. Please use "yyyy-mm-dd" format.');
  }

  // Calculate the difference in milliseconds
  const diffInMs = end.getTime() - start.getTime();

  // Convert milliseconds to weeks
  // 1 week = 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;

  return diffInMs / msPerWeek;
}

export function getFullWeeksBetween(
  startDate: string,
  endDate: string
): number {
  return Math.floor(getWeeksBetween(startDate, endDate));
}

export function getRoundedWeeksBetween(
  startDate: string,
  endDate: string
): number {
  return Math.round(getWeeksBetween(startDate, endDate));
}

export const validateTimeRange = (
  startTime: string,
  endTime: string
): boolean => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return end > start;
};

export const validateDateRange = (
  startDate: string,
  endDate: string
): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end > start;
};

export const getDayName = (dayOfWeek: number): string => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[dayOfWeek] || "Invalid Day";
};

export const dateHasPassed = (date: string): boolean => {
  const targetDate = new Date(date);
  const today = new Date();

  return targetDate < today
}