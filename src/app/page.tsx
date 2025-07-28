"use client";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

// Sample stock data for demonstration purposes
const fakeStockData = [
  { symbol: "AAPL", price: 192.32, change: "+1.2%", volume: 1200000 },
  { symbol: "GOOGL", price: 2845.12, change: "-0.5%", volume: 950000 },
  { symbol: "AMZN", price: 3450.67, change: "+0.8%", volume: 800000 },
  { symbol: "TSLA", price: 720.15, change: "+2.1%", volume: 1500000 },
  { symbol: "MSFT", price: 310.45, change: "-1.0%", volume: 1100000 },
];

const barData = {
  labels: fakeStockData.map((s) => s.symbol),
  datasets: [
    {
      label: "Volume",
      data: fakeStockData.map((s) => s.volume),
      backgroundColor: "#3b82f6",
      borderRadius: 6,
    },
  ],
};

const lineData = {
  labels: fakeStockData.map((s) => s.symbol),
  datasets: [
    {
      label: "Price",
      data: fakeStockData.map((s) => s.price),
      borderColor: "#10b981",
      backgroundColor: "rgba(16,185,129,0.1)",
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: "#10b981",
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Stock Volumes", font: { size: 18 } },
  },
};

const lineOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Stock Prices", font: { size: 18 } },
  },
};

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Stock Market Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Sample Stock Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fakeStockData.map((stock) => (
            <div key={stock.symbol} className="border rounded-lg p-4 flex flex-col items-center bg-blue-50">
              <span className="text-2xl font-bold text-blue-800">{stock.symbol}</span>
              <span className="text-lg mt-2">${stock.price.toLocaleString()}</span>
              <span className={`mt-1 text-sm font-semibold ${stock.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>{stock.change}</span>
              <span className="mt-1 text-xs text-gray-500">Volume: {stock.volume.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
