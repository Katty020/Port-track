import React, { useState, useEffect } from 'react';
import { getStocks, addStock, deleteStock } from '../lib/storage';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Trash2,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchase_price: number;
  current_price?: number;
  price_change?: number;
  last_updated?: string;
}

interface MarketStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' }
];

const fetchStockPrice = async (symbol: string): Promise<number> => {
  const apiKey = 'ctvdpb1r01qh15ov76v0ctvdpb1r01qh15ov76vg';
  const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
  const data = await response.json();
  return data.c; // 'c' is the current price in Finnhub API response
};

const Dashboard = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [marketStocks, setMarketStocks] = useState<MarketStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  const [newStock, setNewStock] = useState({
    symbol: '',
    name: '',
    quantity: '',
    purchase_price: ''
  });

  const fetchStocks = async () => {
    try {
      const storedStocks = getStocks();
      const stocksWithPrices = await Promise.all(
        storedStocks.map(async (stock) => {
          const currentPrice = await fetchStockPrice(stock.symbol);
          return {
            ...stock,
            current_price: currentPrice
          };
        })
      );
      setStocks(stocksWithPrices);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      toast.error('Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketPrices = async () => {
    setMarketLoading(true);
    try {
      const marketData = await Promise.all(
        POPULAR_STOCKS.map(async (stock) => {
          const currentPrice = await fetchStockPrice(stock.symbol);
          const change = currentPrice - (currentPrice * 0.98); // Simulating 2% fluctuation for demonstration
          const changePercent = (change / (currentPrice * 0.98)) * 100;

          return {
            symbol: stock.symbol,
            name: stock.name,
            price: currentPrice,
            change,
            changePercent,
            lastUpdated: new Date().toLocaleTimeString()
          };
        })
      );
      setMarketStocks(marketData);
    } catch (error) {
      console.error('Error fetching market prices:', error);
      toast.error('Failed to fetch market prices');
    } finally {
      setMarketLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchMarketPrices();
    const interval = setInterval(() => fetchMarketPrices(), 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newStockData = {
        symbol: newStock.symbol.toUpperCase(),
        name: newStock.name,
        quantity: Number(newStock.quantity),
        purchase_price: Number(newStock.purchase_price)
      };
      addStock(newStockData);
      toast.success('Stock added successfully');
      setNewStock({ symbol: '', name: '', quantity: '', purchase_price: '' });
      fetchStocks();
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('Failed to add stock');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      deleteStock(id);
      toast.success('Stock deleted successfully');
      fetchStocks();
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast.error('Failed to delete stock');
    }
  };

  const totalValue = stocks.reduce((sum, stock) => stock.current_price ? sum + stock.current_price * stock.quantity : sum, 0);
  const totalInvestment = stocks.reduce((sum, stock) => sum + stock.purchase_price * stock.quantity, 0);
  const totalReturn = totalValue - totalInvestment;
  const returnPercentage = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Add Stock Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Stock</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Symbol"
            value={newStock.symbol}
            onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Name"
            value={newStock.name}
            onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newStock.quantity}
            onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Purchase Price"
            value={newStock.purchase_price}
            onChange={(e) => setNewStock({ ...newStock, purchase_price: e.target.value })}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Stock
        </button>
      </form>

      {/* Portfolio Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Overview</h2>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading portfolio...</p>
        ) : (
          <div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <DollarSign className="h-10 w-10 text-blue-500 mb-2" />
            <p className="text-lg">Total Investment: <span className="font-bold">${totalInvestment.toFixed(2)}</span></p>
          </div>
          <div className="flex flex-col items-center">
            <LineChart className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-lg">Total Value: <span className="font-bold">${totalValue.toFixed(2)}</span></p>
          </div>
          <div className="flex flex-col items-center">
            {totalReturn >= 0 ? (
          <TrendingUp className="h-10 w-10 text-green-500 mb-2" />
            ) : (
          <TrendingDown className="h-10 w-10 text-red-500 mb-2" />
            )}
            <p className="text-lg">Total Return: <span className={`font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>${totalReturn.toFixed(2)} ({returnPercentage.toFixed(2)}%)</span></p>
          </div>
        </div>
        <ul className="space-y-4">
          {stocks.map((stock) => (
            <li key={stock.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
          <div>
            <p className="text-lg font-bold">{stock.name} ({stock.symbol})</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {stock.quantity}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Price: ${stock.current_price?.toFixed(2)}</p>
          </div>
          <button
            onClick={() => handleDelete(stock.id)}
            className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </button>
            </li>
          ))}
        </ul>
          </div>
        )}
      </div>

      {/* Market Overview Section */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Market Overview</h2>
            <button
              onClick={fetchMarketPrices}
              disabled={marketLoading}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${marketLoading ? 'animate-spin' : ''}`} />
              Refresh Market Prices
            </button>
          </div>
          {marketLoading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading market data...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {marketStocks.map((stock) => (
                <div key={stock.symbol} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{stock.symbol}</h3>
                    {stock.change >= 0 ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{stock.name}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
                  <div className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last updated: {stock.lastUpdated}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
