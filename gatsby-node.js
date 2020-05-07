const fetch = require("node-fetch")

// TODO Move to constants
const yahooFinanceBaseURL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com"
const host = "apidojo-yahoo-finance-v1.p.rapidapi.com"

// TODO Move to constants
const queriesMap = {
  "get-historical-data": { requiredKeys: ["period1", "period2", "symbol"] },
  "get-balance-sheet": { requiredKeys: ["symbol"] },
  "get-charts": { requiredKeys: ["region", "lang", "interval", "range"] },
  "get-movers": { requiredKeys: ["region", "lang"] },
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

const executeQuery = async query => {
  // Make sure all required data is present for that request
  // Setup request query string
  // Make request
  // Call "addNode" with response
  // Catch errors

  if (!queriesMap[query.type]) {
    console.error(
      `[gatsby-yahoo-finance-api] ${query.type} is not a supported query.`
    )
    return
  }
  if (!hasRequiredFields(query)) {
    console.error(
      `[gatsby-yahoo-finance-api] Some or all required fields are missing for ${query.type} query.`
    )
    return
  }

  console.log("Query is ready")
}

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { key, queries } = pluginOptions

  if (!key) {
    console.error("[gatsby-yahoo-finance-api] API Key is required")
    return
  }
  if (!queries || !queries.length) {
    console.error("[gatsby-yahoo-finance-api] At least one query is required")
    return
  }

  // Query data
  queries.forEach(query => executeQuery(query))
}
