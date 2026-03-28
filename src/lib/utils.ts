import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let counter = 0;
export function v4(): string {
  return `${Date.now()}-${++counter}-${Math.random().toString(36).slice(2, 9)}`;
}
