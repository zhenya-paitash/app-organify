import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(length: number = 10): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < length; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));

  return code;
}

export function convertSnakeToTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/_/, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}

