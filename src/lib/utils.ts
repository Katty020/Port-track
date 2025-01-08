import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchStockPrice(symbol: string, apiKey: string): Promise<number> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await response.json();
    return parseFloat(data['Global Quote']['05. price']);
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return 0;
  }
}