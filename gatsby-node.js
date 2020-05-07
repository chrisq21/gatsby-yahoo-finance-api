const fetch = require("node-fetch")

// TODO Move to constants
const yahooFinanceBaseURL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com"
const yahooFinanceBaseHost = "apidojo-yahoo-finance-v1.p.rapidapi.com"

// TODO Move to constants
const queriesMap = {
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

const hasRequiredFields = query => {
  if (!query.params || !Object.keys(query.params).length) {
    return false
  }

  const queryParamsKeys = Object.keys(query.params)
  const requiredKeys = queriesMap[query.type].requiredKeys
  return requiredKeys.every(
    requiredField =>
      queryParamsKeys.includes(requiredField) && !!query.params[requiredField]
  )
}

const getQueryURLWithParams = (queryType, queryParams) => {
  const querySlug = queriesMap[queryType].slug
  const queryURL = new URL(`${yahooFinanceBaseURL}/${querySlug}`)
  Object.entries(queryParams).forEach(([key, value]) =>
    queryURL.searchParams.append(key, value)
  )
  return queryURL.href
}

const executeQuery = async (key, query) => {
  if (!queriesMap[query.type]) {
    return Promise.reject(
      new Error(
        `[gatsby-yahoo-finance-api] ${query.type} is not a supported query.`
      )
    )
  }
  if (!hasRequiredFields(query)) {
    return Promise.reject(
      new Error(
        `[gatsby-yahoo-finance-api] Some or all required fields are missing for ${query.type} query.`
      )
    )
  }

  const endpoint = getQueryURLWithParams(query.type, query.params)
  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-rapidapi-host": yahooFinanceBaseHost,
        "x-rapidapi-key": key,
      },
    })

    const data = await response.json()

    return { ...data, queryType: query.type }
  } catch (error) {
    return Promise.reject(error)
  }
}

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions
  const { key, queries } = pluginOptions

  if (!key) {
    console.error("[gatsby-yahoo-finance-api] API Key is required")
    return
  }
  if (!queries || !queries.length) {
    console.error("[gatsby-yahoo-finance-api] At least one query is required")
    return
  }

  const queryPromises = queries.map(query => executeQuery(key, query))

  Promise.all(queryPromises)
    .then(queryResponses => {
      queryResponses.forEach(response => {
        const nodeType = queriesMap[response.queryType].nodeType
        const nodeMeta = {
          id: createNodeId(`${nodeType}-${response.id}`),
          internal: {
            type: nodeType,
            contentDigest: createContentDigest(response),
          },
        }
        const node = { ...response, ...nodeMeta }
        createNode(node)
      })
    })
    .catch(error => console.error("Error: ", error.message))
}
