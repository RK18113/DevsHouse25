import React, { useState, useRef, useEffect } from "react";

const ChatBot = ({ isDarkMode, selectedInvestment, portfolioData }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: selectedInvestment
        ? `Hello! I'm analyzing ${selectedInvestment.name} (${selectedInvestment.symbol}). What would you like to know about this investment?`
        : "Hello! I'm your AI investment advisor. Please select an investment from the left panel to get detailed insights, or ask me about your overall portfolio performance.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Update messages when selected investment changes
  useEffect(() => {
    if (selectedInvestment) {
      setMessages([
        {
          role: "assistant",
          content: `I'm analyzing ${selectedInvestment.name} (${
            selectedInvestment.symbol
          }). 
            Current price: $${selectedInvestment.price}
            Allocation: ${selectedInvestment.allocation}%
            Value: $${selectedInvestment.value.toLocaleString()}
            
            What would you like to know about this investment?`,
        },
      ]);
    }
  }, [selectedInvestment]);

  const generateAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (!selectedInvestment) {
      return `Please select an investment from the left panel for detailed analysis. For your overall portfolio: 
        - Total value: $${portfolioData.totalAssets.toLocaleString()}
        - Performance: ${portfolioData.performance}
        - Monthly growth: ${portfolioData.monthlyGrowth}%`;
    }

    // Mock AI analysis data for the selected investment
    const analysis = {
      sentiment: "Positive",
      riskLevel: "Moderate",
      shortTerm: "Bullish",
      longTerm: "Strong Buy",
      technicalIndicators: {
        rsi: 62,
        macd: "Positive",
        movingAverage: "Above 200-day MA",
      },
      fundamentals: {
        peRatio: 22.4,
        marketCap: "234.5B",
        dividendYield: "2.1%",
      },
    };

    if (lowerMessage.includes("risk")) {
      return `${selectedInvestment.name} has a ${
        analysis.riskLevel
      } risk profile. The RSI is currently at ${
        analysis.technicalIndicators.rsi
      }, indicating ${
        analysis.technicalIndicators.rsi > 70
          ? "overbought"
          : analysis.technicalIndicators.rsi < 30
          ? "oversold"
          : "neutral"
      } conditions.`;
    }

    if (
      lowerMessage.includes("recommend") ||
      lowerMessage.includes("buy") ||
      lowerMessage.includes("sell")
    ) {
      return `Based on current analysis, ${selectedInvestment.name} shows a ${analysis.sentiment} outlook. Technical indicators are ${analysis.technicalIndicators.macd}, and the stock is ${analysis.technicalIndicators.movingAverage}. The long-term recommendation is ${analysis.longTerm}.`;
    }

    if (
      lowerMessage.includes("technical") ||
      lowerMessage.includes("analysis")
    ) {
      return `Technical Analysis for ${selectedInvestment.name}:
        - RSI: ${analysis.technicalIndicators.rsi}
        - MACD: ${analysis.technicalIndicators.macd}
        - Trend: ${analysis.technicalIndicators.movingAverage}
        - Short-term outlook: ${analysis.shortTerm}`;
    }

    if (
      lowerMessage.includes("fundamental") ||
      lowerMessage.includes("fundamentals")
    ) {
      return `Fundamental metrics for ${selectedInvestment.name}:
        - P/E Ratio: ${analysis.fundamentals.peRatio}
        - Market Cap: $${analysis.fundamentals.marketCap}
        - Dividend Yield: ${analysis.fundamentals.dividendYield}`;
    }

    return `I can help you analyze ${selectedInvestment.name} from various angles:
      - Technical analysis and trends
      - Risk assessment
      - Buy/Sell recommendations
      - Fundamental metrics
      
      What specific aspect would you like to know about?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate AI response
      const response = generateAIResponse(userMessage);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`h-full flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">AI Investment Advisor</h2>
        <button
          className={`p-1 rounded-full ${
            isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
          }`}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                isDarkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your investments..."
            className={`flex-1 p-2 rounded-lg resize-none ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-gray-100 text-gray-800 border-gray-200"
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`ml-2 p-2 rounded-full ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
