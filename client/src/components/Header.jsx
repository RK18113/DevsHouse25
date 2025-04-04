import React from "react";

const Header = ({ isDarkMode, toggleDarkMode, viewMode, setViewMode }) => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold">InvestSmart.ai</h1>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={() => setViewMode("assets")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === "assets" ? "bg-cyan-500 text-white" : ""
          }`}
        >
          Assets
        </button>

        <button
          onClick={() => setViewMode("wishlist")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === "wishlist" ? "bg-cyan-500 text-white" : ""
          }`}
        >
          Watchlist
        </button>

        <button
          onClick={() => setViewMode("chat")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === "chat" ? "bg-cyan-500 text-white" : ""
          }`}
        >
          AI Insights
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
};

export default Header;
