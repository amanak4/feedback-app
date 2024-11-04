import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


// this file is for tailwind merge and clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
