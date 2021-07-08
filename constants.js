exports.yahooFinanceBaseURL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com"
exports.yahooFinanceAPIHost = "apidojo-yahoo-finance-v1.p.rapidapi.com"

exports.queriesMap = {
  "get-profile": {
    nodeType: "StockProfile",
    slug: "stock/v2/get-profile",
    requiredKeys: ["symbol", "region"],
  },
  "get-historical-data": {
    nodeType: "StockHistoricalData",
    slug: "stock/v2/get-historical-data",
    requiredKeys: ["period1", "period2", "symbol"],
  },
  "get-balance-sheet": {
    nodeType: "StockBalanceSheet",
    slug: "stock/v2/get-balance-sheet",
    requiredKeys: ["symbol"],
  },
  "get-charts": {
    nodeType: "MarketCharts",
    slug: "market/get-charts",
    requiredKeys: ["region", "lang", "interval", "range"],
  },
  "get-movers": {
    nodeType: "MarketMovers",
    slug: "market/get-movers",
    requiredKeys: ["region", "lang"],
  },
}
