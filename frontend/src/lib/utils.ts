import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToISO(dateStr: string) {
  // Tách các phần của chuỗi ngày giờ
  const flag = dateStr.substring(1, 2) === ' ' ? 1 : 0;
  const day = dateStr.substring(0, 2 - flag);
  const month = dateStr.substring(3 - flag, 6 - flag);
  const year = dateStr.substring(7 - flag, 11 - flag);
  const time = dateStr.substring(12 - flag, dateStr.length - 2);

  // Tạo một chuỗi ngày giờ theo định dạng ISO 8601
  const isoDateStr = `${day} ${month} ${year} ${time}`;
  return isoDateStr;
}