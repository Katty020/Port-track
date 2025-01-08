interface Stock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchase_price: number;
  current_price?: number;
}

const STORAGE_KEY = 'portfolio_stocks';

export const getStocks = (): Stock[] => {
  const stocks = localStorage.getItem(STORAGE_KEY);
  return stocks ? JSON.parse(stocks) : [];
};

export const addStock = (stock: Omit<Stock, 'id'>): Stock => {
  const stocks = getStocks();
  const newStock = {
    ...stock,
    id: crypto.randomUUID(),
  };
  stocks.push(newStock);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  return newStock;
};

export const updateStock = (stock: Stock): void => {
  const stocks = getStocks();
  const index = stocks.findIndex(s => s.id === stock.id);
  if (index !== -1) {
    stocks[index] = stock;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  }
};

export const deleteStock = (id: string): void => {
  const stocks = getStocks();
  const filteredStocks = stocks.filter(stock => stock.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredStocks));
};