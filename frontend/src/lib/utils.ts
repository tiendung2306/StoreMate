import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToISO(dateStr: string) {
  // Tách các phần của chuỗi ngày giờ
  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(3, 6);
  const year = dateStr.substring(7, 11);
  const time = dateStr.substring(12, dateStr.length - 2);
  const period = dateStr.substring(dateStr.length - 2).toUpperCase();

  // Tạo một chuỗi ngày giờ theo định dạng ISO 8601
  const isoDateStr = `${day} ${month} ${year} ${time}`;
  return isoDateStr;
}