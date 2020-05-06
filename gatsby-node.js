const fetch = require("node-fetch")

const yahooFinanceBaseURL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com"

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  // 1. Loop through all queries in pluginOptions
  // 2. Ensure that the required values are filled out for each query
  // 3. Throw errors if required fields are missing
  // 4. Initiate each query
  // 5. Catch query error, and throw customized error
  // 6. Create  nodes from the response using a shared helper function
  // 7. Display errors if found
}
