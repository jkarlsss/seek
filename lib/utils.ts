import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPostedDate(createdAt?: Date | string) {
  if (!createdAt) return "Recently posted";

  const createdDate = new Date(createdAt);
  const today = new Date();

  const diffTime = today.getTime() - createdDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Recently posted";
  }

  if (diffDays === 1) {
    return "Posted 1 day ago";
  }

  return `Posted ${diffDays} days ago`;
}