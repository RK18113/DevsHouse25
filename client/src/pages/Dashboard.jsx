import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Header from "../components/Header";
import ChatBot from "./ChatBot";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState("assets");
  const [selectedSource, setSelectedSource] = useState("portfolio");
  const [showChatBot, setShowChatBot] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showWishlistEditor, setShowWishlistEditor] = useState(false);

  // State for portfolio data
  const [portfolioData, setPortfolioData] = useState({
    totalAssets: 49825.82,
    growthPercentage: 1.9,
    growthAmount: 747.29,
    performance: "Strong performance",
    totalProfit: 6801.19,
    profitPercentage: 15.81,
    monthlyGrowth: -1.34,
    monthlyAmount: -523,
    bestProfitAsset: {
      name: "Technology ETF",
      symbol: "TECH",
    },
    portfolioScore: {
      grade: "B",
      score: 69,
      maxScore: 100,
      status: "Good",
    },
    aira: {
      score: 74,
      description: "Allocation accuracy",
    },
    pri: {
      score: 0.45,
      description: "Risk index: Moderate",
    },
    timeRange: "Last 30 days",
    chartSources: {
      portfolio: {
        labels: ["10-25", "11-1", "11-5", "11-10", "11-15", "11-20"],
        values: [49000, 48000, 49500, 51000, 50000, 49825],
      },
      spy: {
        labels: ["10-25", "11-1", "11-5", "11-10", "11-15", "11-20"],
        values: [47000, 48500, 48000, 49000, 48500, 48750],
      },
      nasdaq: {
        labels: ["10-25", "11-1", "11-5", "11-10", "11-15", "11-20"],
        values: [50000, 49500, 51000, 52000, 51500, 51750],
      },
    },
    investments: [
      {
        name: "Technology ETF",
        symbol: "TECH",
        amount: 26.4,
        value: 9767.63,
        allocation: 19.62,
        price: 369.98,
        color: "#00d9ff",
      },
      {
        name: "S&P 500 Index Fund",
        symbol: "SPY",
        amount: 30.5,
        value: 6152.28,
        allocation: 12.28,
        price: 201.68,
        color: "#00d9ff",
      },
      {
        name: "Growth Stocks",
        symbol: "GRWTH",
        amount: 213.9,
        value: 8026.25,
        allocation: 16.1,
        price: 37.5,
        color: "#f0f0f0",
      },
      {
        name: "Dividend Portfolio",
        symbol: "DIV",
        amount: 443.51,
        value: 5769.78,
        allocation: 11.66,
        price: 13.0,
        color: "#f0f0f0",
      },
      {
        name: "Green Energy Fund",
        symbol: "GRN",
        amount: 109.6,
        value: 5597.51,
        allocation: 11.24,
        price: 51.1,
        color: "#f0f0f0",
      },
      {
        name: "Real Estate REIT",
        symbol: "REIT",
        amount: 210.17,
        value: 5446.31,
        allocation: 10.97,
        price: 25.9,
        color: "#f0f0f0",
      },
      {
        name: "Bond Fund",
        symbol: "BOND",
        amount: 1040.8,
        value: 4770.86,
        allocation: 9.61,
        price: 4.6,
        color: "#f0f0f0",
      },
      {
        name: "Emerging Markets",
        symbol: "EM",
        amount: 304,
        value: 4197.2,
        allocation: 8.52,
        price: 13.81,
        color: "#f0f0f0",
      },
    ],
  });

  // Sample wishlist data
  const [wishlistData, setWishlistData] = useState({
    items: [
      {
        name: "Apple Inc.",
        symbol: "AAPL",
        amount: 15,
        value: 2602.5,
        currentPrice: 173.5,
        targetPrice: 200.0,
        allocation: 5.22,
        chartData: {
          labels: ["10-25", "11-1", "11-5", "11-10", "11-15", "11-20"],
          values: [165, 170, 168, 175, 172, 173.5],
        },
      },
      {
        name: "Microsoft Corporation",
        symbol: "MSFT",
        amount: 10,
        value: 3761.7,
        currentPrice: 376.17,
        targetPrice: 400.0,
        allocation: 7.55,
        chartData: {
          labels: ["10-25", "11-1", "11-5", "11-10", "11-15", "11-20"],
          values: [360, 365, 370, 368, 375, 376.17],
        },
      },
      // Add more items as needed
    ],
  });

  // Fetch data from backend
  useEffect(() => {
    // Example API call - replace with your actual API endpoint
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('your-api-endpoint');
    //     const data = await response.json();
    //     setPortfolioData(data);
    //   } catch (error) {
    //     console.error('Error fetching portfolio data:', error);
    //   }
    // };
    // fetchData();
  }, []);

  // Chart options and data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#f0f0f0",
        },
        ticks: {
          callback: function (value) {
            return value / 1000 + "k";
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        borderColor: "rgba(0, 0, 0, 0.7)",
        fill: false,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  };

  const chartData = {
    labels: portfolioData.chartSources[selectedSource].labels,
    datasets: [
      {
        data: portfolioData.chartSources[selectedSource].values,
        borderColor: isDarkMode ? "rgb(0, 217, 255)" : "rgba(0, 0, 0, 0.7)",
      },
    ],
  };

  // Function to get current data based on view mode
  const getCurrentData = () => {
    return viewMode === "assets"
      ? portfolioData.investments
      : wishlistData.items;
  };

  // Function to get chart data based on selected investment
  const getChartData = () => {
    if (selectedInvestment?.chartData) {
      return {
        labels: selectedInvestment.chartData.labels,
        datasets: [
          {
            data: selectedInvestment.chartData.values,
            borderColor: isDarkMode ? "rgb(0, 217, 255)" : "rgba(0, 0, 0, 0.7)",
          },
        ],
      };
    }
    return chartData; // Default chart data
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const closeProfile = (e) => {
      if (isProfileOpen && !e.target.closest(".profile-menu")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", closeProfile);
    return () => document.removeEventListener("click", closeProfile);
  }, [isProfileOpen]);

  // Add new function to handle investment click
  const handleInvestmentClick = (investment) => {
    setSelectedInvestment(investment);
  };

  // Function to handle view mode changes
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setSelectedInvestment(null); // Reset selected investment when changing views
  };

  // Wishlist Editor Modal Component
  const WishlistEditorModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
        <div
          className={`${
            isDarkMode ? "bg-gray-800/95" : "bg-white/95"
          } rounded-xl p-6 max-w-2xl w-full mx-4 relative shadow-xl`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <h3 className="text-xl font-bold mb-4">Edit Wishlist</h3>
          {/* Add your wishlist editing form here */}
          <div className="space-y-4">
            {wishlistData.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-100"
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.symbol}</div>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            ))}
            <button className="w-full py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
              + Add New Stock
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Details Section Component
  const DetailsSection = ({ item, viewMode, isDarkMode }) => {
    if (!item)
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          Select an item to view details
        </div>
      );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mr-4">
              {item.symbol.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="text-gray-500">{item.symbol}</p>
            </div>
          </div>
          {viewMode === "wishlist" && (
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
              Add to Portfolio
            </button>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div
            className={`p-4 rounded-xl ${
              isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
            }`}
          >
            <p className="text-gray-500 text-sm">Current Price</p>
            <p className="text-xl font-bold">
              $
              {(viewMode === "wishlist"
                ? item.currentPrice
                : item.price
              ).toFixed(2)}
            </p>
          </div>
          <div
            className={`p-4 rounded-xl ${
              isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
            }`}
          >
            <p className="text-gray-500 text-sm">
              {viewMode === "wishlist" ? "Target Price" : "Units"}
            </p>
            <p className="text-xl font-bold">
              {viewMode === "wishlist" ? `$${item.targetPrice}` : item.amount}
            </p>
          </div>
        </div>

        {/* Performance Section */}
        <div
          className={`p-6 rounded-xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
          }`}
        >
          <h4 className="text-lg font-semibold mb-4">Performance</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Add performance metrics */}
          </div>
        </div>

        {/* Analysis Section */}
        <div
          className={`p-6 rounded-xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
          }`}
        >
          <h4 className="text-lg font-semibold mb-4">Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Add analysis metrics */}
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    switch (viewMode) {
      case "chat":
        return (
          <div className="h-full grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="h-full overflow-y-auto space-y-6 pr-3">
              <div>
                <h1
                  className={`text-4xl ${
                    isDarkMode ? "text-gray-400" : "text-gray-300"
                  } font-light`}
                >
                  AI Insights
                </h1>
                <h2 className="text-xl font-medium mt-4">Portfolio Analysis</h2>
              </div>

              {/* Chart */}
              <div
                className={`p-6 rounded-xl ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-200 text-gray-800"
                    } border focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  >
                    <option value="portfolio">Portfolio Performance</option>
                    <option value="spy">S&P 500 Comparison</option>
                    <option value="nasdaq">NASDAQ Comparison</option>
                  </select>
                </div>
                <div className="h-[240px]">
                  <Line
                    options={chartOptions}
                    data={selectedInvestment ? getChartData() : chartData}
                  />
                </div>
              </div>

              {/* Investment Selection */}
              <div
                className={`p-6 rounded-xl ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                }`}
              >
                <h3 className="text-lg font-medium mb-4">
                  Select Investment to Analyze
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {portfolioData.investments.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedInvestment(item)}
                      className={`${
                        selectedInvestment?.symbol === item.symbol
                          ? "bg-cyan-500 text-white"
                          : isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } p-4 rounded-xl cursor-pointer transition-all duration-300`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 ${
                            selectedInvestment?.symbol === item.symbol
                              ? "bg-white text-cyan-500"
                              : "bg-black text-white"
                          } rounded-full flex items-center justify-center mr-3`}
                        >
                          {item.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div
                            className={`${
                              selectedInvestment?.symbol === item.symbol
                                ? "text-cyan-100"
                                : "text-gray-500"
                            } text-sm`}
                          >
                            {item.symbol}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - ChatBot */}
            <div
              className={`${
                isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
              } rounded-xl h-full overflow-hidden`}
            >
              <ChatBot
                isDarkMode={isDarkMode}
                selectedInvestment={selectedInvestment}
                portfolioData={portfolioData}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="h-full overflow-y-auto space-y-6 pr-3">
              <div>
                <h1
                  className={`text-4xl ${
                    isDarkMode ? "text-gray-400" : "text-gray-300"
                  } font-light`}
                >
                  {viewMode === "assets"
                    ? "Dashboard"
                    : viewMode === "chat"
                    ? "AI Insights"
                    : "Watchlist"}
                </h1>
                <h2 className="text-xl font-medium mt-4">Evaluation</h2>
              </div>

              {/* Total Portfolio Value */}
              <div
                className={`p-6 rounded-xl ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                }`}
              >
                <div className="text-gray-500">Total portfolio value</div>
                <div className="flex items-baseline">
                  <span className="text-2xl md:text-3xl font-bold mr-2">
                    $
                    {portfolioData.totalAssets.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`${
                      isDarkMode
                        ? "bg-green-900 text-green-300"
                        : "bg-green-100 text-green-800"
                    } px-2 py-0.5 rounded text-sm`}
                  >
                    ▲ {portfolioData.growthPercentage}% $
                    {portfolioData.growthAmount}
                  </span>
                </div>
                <div
                  className={`inline-block ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  } px-3 py-1 rounded-full mt-1 text-sm`}
                >
                  <span>{portfolioData.performance} 👍</span>
                </div>
              </div>

              {/* Chart */}
              <div
                className={`p-6 rounded-xl ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-200 text-gray-800"
                    } border focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  >
                    <option value="portfolio">Portfolio Performance</option>
                    <option value="spy">S&P 500 Comparison</option>
                    <option value="nasdaq">NASDAQ Comparison</option>
                  </select>
                </div>
                <div className="h-[240px]">
                  <Line
                    options={chartOptions}
                    data={selectedInvestment ? getChartData() : chartData}
                  />
                </div>
              </div>

              {/* Portfolio metrics */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-gray-500 text-xs">Total profit</div>
                  <div className="text-sm lg:text-base font-bold text-green-600">
                    +${portfolioData.totalProfit.toLocaleString()}
                  </div>
                  <div className="text-green-600 text-xs">
                    +{portfolioData.profitPercentage}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">
                    Avg. monthly return
                  </div>
                  <div className="text-sm lg:text-base font-bold text-red-600">
                    ~{portfolioData.monthlyGrowth}% ▼
                  </div>
                  <div className="text-red-600 text-xs">
                    ~${Math.abs(portfolioData.monthlyAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">
                    Best-performing asset
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-200 w-4 h-4 lg:w-5 lg:h-5 rounded-full flex items-center justify-center mr-1 text-xs">
                      T
                    </div>
                    <div>
                      <div className="text-sm lg:text-base font-bold">
                        {portfolioData.bestProfitAsset.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {portfolioData.bestProfitAsset.symbol}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio score */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-gray-500 text-xs">Portfolio health</div>
                  <div className="flex items-center mt-1">
                    <div
                      className={`w-6 h-6 lg:w-8 lg:h-8 ${
                        isDarkMode ? "bg-green-900" : "bg-green-100"
                      } rounded-full flex items-center justify-center text-sm lg:text-base font-bold mr-2`}
                    >
                      {portfolioData.portfolioScore.grade}
                    </div>
                    <div className="text-sm lg:text-base font-bold">
                      {portfolioData.portfolioScore.score}
                      <span
                        className={`${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        } font-normal text-xs`}
                      >
                        /{portfolioData.portfolioScore.maxScore}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {portfolioData.portfolioScore.status}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">AIRA</div>
                  <div className="text-sm lg:text-base font-bold mt-1">
                    {portfolioData.aira.score}% ▲
                    <span className="text-xs ml-1">ℹ️</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {portfolioData.aira.description}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">PRI</div>
                  <div className="text-sm lg:text-base font-bold mt-1">
                    {portfolioData.pri.score}
                    <span className="text-xs ml-1">ℹ️</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {portfolioData.pri.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="h-full overflow-y-auto pr-3">
              {selectedInvestment ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium">
                      {selectedInvestment.name} Details
                    </h2>
                    <button
                      onClick={() => setSelectedInvestment(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div
                    className={`p-6 rounded-xl ${
                      isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                      <div>
                        <p className="text-gray-500 text-sm">Current Value</p>
                        <p className="text-xl font-bold">
                          ${selectedInvestment.value.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Units</p>
                        <p className="text-xl font-bold">
                          {selectedInvestment.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Price Per Unit</p>
                        <p className="text-xl font-bold">
                          ${selectedInvestment.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Allocation</p>
                        <p className="text-xl font-bold">
                          {selectedInvestment.allocation}%
                        </p>
                      </div>
                    </div>

                    {/* Performance Section */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-3">
                        Performance
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-gray-500 text-sm">Daily Change</p>
                          <p className="text-green-500 font-medium">+2.34%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Weekly Change</p>
                          <p className="text-red-500 font-medium">-1.12%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">
                            Monthly Return
                          </p>
                          <p className="text-green-500 font-medium">+5.67%</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">YTD Return</p>
                          <p className="text-green-500 font-medium">+12.45%</p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Analysis Section */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-3">
                        Risk Analysis
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-gray-500 text-sm">Volatility</p>
                          <p className="font-medium">Medium</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Beta</p>
                          <p className="font-medium">1.12</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Sharpe Ratio</p>
                          <p className="font-medium">1.34</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Risk Score</p>
                          <p className="font-medium">7/10</p>
                        </div>
                      </div>
                    </div>

                    {/* Market Information */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Market Information
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-gray-500 text-sm">Market Cap</p>
                          <p className="font-medium">$234.5B</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">P/E Ratio</p>
                          <p className="font-medium">22.4</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">52W High</p>
                          <p className="font-medium">
                            ${(selectedInvestment.price * 1.2).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">52W Low</p>
                          <p className="font-medium">
                            ${(selectedInvestment.price * 0.8).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">
                      {viewMode === "assets" ? "Asset Allocation" : "Watchlist"}
                    </h2>
                    {viewMode === "wishlist" && (
                      <button
                        onClick={() => setShowWishlistEditor(true)}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                      >
                        Edit Watchlist
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {getCurrentData().map((item, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedInvestment(item)}
                        className={`${
                          viewMode === "assets" && index < 2
                            ? "bg-cyan-300 hover:bg-cyan-400"
                            : isDarkMode
                            ? "bg-gray-800/50 hover:bg-gray-700"
                            : "bg-gray-50 hover:bg-gray-100"
                        } p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white mr-3">
                            {item.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-gray-500 text-sm">
                              {item.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-2xl font-medium">
                            {viewMode === "assets"
                              ? item.amount
                              : `$${item.currentPrice}`}
                          </div>
                          <div className="text-sm font-medium">
                            {viewMode === "assets"
                              ? `${item.allocation}%`
                              : `Target: $${item.targetPrice}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        viewMode={viewMode}
        setViewMode={(mode) => {
          setViewMode(mode);
          setSelectedInvestment(null);
        }}
      />

      {/* Update padding here */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full max-w-[1920px] mx-auto">
          {renderMainContent()}
        </div>
      </div>

      {showWishlistEditor && (
        <WishlistEditorModal onClose={() => setShowWishlistEditor(false)} />
      )}
    </div>
  );
};

export default Dashboard;
