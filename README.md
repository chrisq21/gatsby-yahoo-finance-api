# gatsby-yahoo-finance-api

Source plugin for pulling in market and individual stock data into [Gatsby][gatsby] from the unofficial [Yahoo Finance API][yahoo-finance-api] hosted by [Rapid API][rapid-api].

Yahoo deprecated their API in 2012, but it has since been made available on [Rapid API][yahoo-finance-api] and still provides valuable data for current and historical stock market information.

## Available data

- Historical (and current at the time of build) pricing data and metadata for an individual stock or many stocks.
- Balance sheet data for an individual stock
- "Market Mover" data. (x number of stocks with the largest gains, losses, and most active trading at time of build).

This is only a small subset of the data offered by the Yahoo Finance API, so if there's something missing that you'd like to see added please open an issue or create a pull request in Github!

## Install

```shell
npm install --save gatsby-yahoo-finance-api
```

## How to use

First you'll need to create an Rapid API account to retrieve an API key [here][yahoo-finance-api].

Then in your `gatsby-config.js`, add the following plugin configuration for Gatsby to pull in your data:

```js
plugins: [
  {
    resolve: "gatsby-yahoo-finance-api",
    options: {
      /* Your Yahoo Finance API Key (Required) */
      key: "<YOUR_API_KEY>",

      /* 
        An array of queries you want to make (The data you want to fetch at build time). 
        At least one query object is required. 
      */
      queries: [
        /* 
          Below is a list of all queries available, with their associated types and params.

          All queries must have a "type" and a "params" field
          The query type determines which query will be made. 
        
          Note: Timestamps for this API are in Unix epoch time. Refer to https:/www.epochconverter.com/ to determine a timestamp for a given date.
        */

        {
          type: "get-historical-data",
          params: {
            period1: "1431010482", // (Required) Epoch timestamp
            period2: "1588863282", // (Required) Epoch timestamp
            symbol: "TSLA", // (Required) Stock ticker/symbol
            frequency: "1d", // (Optional) Options: 1d | 1w | 1mo
          },
        },
        {
          type: "get-balance-sheet",
          params: {
            symbol: "TSLA", // (Required) Stock ticker/symbol
          },
        },
        {
          type: "get-movers",
          params: {
            region: "US", // (Required) Options: AU | CA | FR | DE | HK | US | IT | ES | GB | IN
            lang: "en", // (Required) Options:  en | fr | de | it | es | zh
            count: "10", // The number of quotes to display in day gainers / losers / activies
          },
        },
        {
          type: "get-charts",
          params: {
            symbol: "TSLA", // (Required) Stock ticker/symbol
            region: "US", // (Required) Options: AU | CA | FR | DE | HK | US | IT | ES | GB | IN
            lang: "en", // (Required) Options:  en | fr | de | it | es | zh
            range: "3mo", // (Required) Options: 1d | 5d | 3mo | 6mo | 1y | 5y | max
            interval: "1mo", // (Required) Options: 5m | 15m | 1d | 1wk | 1mo
            comparisons: "APPL,GOOG", // (Optional) Comma seperated list of stock symbols to retrieve financial data for
          },
        },
      ],
    },
  },
]
```

## How to query

Once the build is done, the following node types will be available in your GraphQL queries (depending on which queries were made)

- stockHistoricalData
- stockBalanceSheet
- marketMovers
- marketCharts

You can query generated nodes like the following:

```graphql
{
  allStockHistoricalData {
    edges {
      node {
        prices {
          close
          open
          date
        }
      }
    }
  }
}
```

[gatsby]: https://www.gatsbyjs.org/
[yahoo-finance-api]: https://rapidapi.com/apidojo/api/yahoo-finance1/
[rapid-api]: https://rapidapi.com/
