const {
  yahooFinanceBaseURL,
  yahooFinanceAPIHost,
  queriesMap,
} = require("./constants")

const { executeQuery } = require("./helpers")

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions
  const { key, queries } = pluginOptions

  /* Make sure key and queries are defined */
  if (!key) {
    return Promise.reject(
      new Error(`[gatsby-yahoo-finance-api] API Key is required`)
    )
  }
  if (!queries || !queries.length) {
    return Promise.reject(
      new Error(`[gatsby-yahoo-finance-api] At least one query is required`)
    )
  }

  /* Execute all queries provided from the pluginOptions object */
  const queryPromises = queries.map(query =>
    executeQuery(
      key,
      query,
      queriesMap,
      yahooFinanceAPIHost,
      yahooFinanceBaseURL
    )
  )

  /* Create nodes with the query response data once it's all retrieved */
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
