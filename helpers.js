const fetch = require("node-fetch")

/**
 *
 * @param {object} query
 * @param {object} queriesMap
 * @return {boolean}
 * @description Determines whether or not a query object contains all the required fields
 * associated with it's query type
 */
const hasRequiredFields = (query, queriesMap) => {
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

/**
 *
 * @param {string} queryType
 * @param {array} queryParams
 * @param {object} queriesMap
 * @param {string} yahooFinanceBaseURL
 * @return {string}
 * @description Generates a URL with query parameters
 */
const getQueryURLWithParams = (
  queryType,
  queryParams,
  queriesMap,
  yahooFinanceBaseURL
) => {
  const querySlug = queriesMap[queryType].slug
  const queryURL = new URL(`${yahooFinanceBaseURL}/${querySlug}`)
  Object.entries(queryParams).forEach(([key, value]) =>
    queryURL.searchParams.append(key, value)
  )
  return queryURL.href
}

/**
 *
 * @param {string} key
 * @param {object} query
 * @param {object} queriesMap
 * @param {string} yahooFinanceAPIHost
 * @param {string} yahooFinanceBaseURL
 * @return {Promise}
 * @description Fetches query data after validating that all required query parameters are set
 */
exports.executeQuery = async (
  key,
  query,
  queriesMap,
  yahooFinanceAPIHost,
  yahooFinanceBaseURL
) => {
  /* Make sure that a query with the given query type exists in the queriesMap */
  if (!queriesMap[query.type]) {
    return Promise.reject(
      new Error(
        `[gatsby-yahoo-finance-api] ${query.type} is not a supported query.`
      )
    )
  }
  /* Validate required fields */
  if (!hasRequiredFields(query, queriesMap)) {
    return Promise.reject(
      new Error(
        `[gatsby-yahoo-finance-api] Some or all required fields are missing for ${query.type} query.`
      )
    )
  }

  const apiEndpoint = getQueryURLWithParams(
    query.type,
    query.params,
    queriesMap,
    yahooFinanceBaseURL
  )
  try {
    const response = await fetch(apiEndpoint, {
      headers: {
        "x-rapidapi-host": yahooFinanceAPIHost,
        "x-rapidapi-key": key,
      },
    })

    if (!response.ok) {
      const errorMsg = `[gatsby-yahoo-finance-api] ${query.type} request failed with message: ${response.statusText}`
      return Promise.reject(new Error(errorMsg))
    }

    const data = await response.json()
    return { ...data, queryType: query.type }
  } catch (error) {
    return Promise.reject(error)
  }
}
