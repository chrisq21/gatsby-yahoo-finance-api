//no-op

/* 

Notes 

--Stock--

/get-historical-data
* Required
* * Period 1: Number (Epoch timestamp)
* * Period 2: Number (Epoch timestamp)
* * Symbol: String
* Optional
* * Frequency: String (options: 1d|1w|1mo)

/get-balance-sheet
* Required
* * Symbol: String 


--Market--

/get-charts
* Required
* * Region: String (options: (AU | CA | FR | DE | HK | US | IT | ES | GB | IN))
* * lang: String (options:  (en | fr | de | it | es | zh))
* * Interval: String(options: (5m | 15m | 1d | 1wk | 1mo))
* * Range: String (options: (1d | 5d | 3mo | 6mo | 1y | 5y | max))
* Optional
* * Comparisons: Comma seperated string (options: 1d|1w|1mo) -- No spaces are allowed. Maybe remove spaces if they are found just in case

/get-movers
* Required
* * Region: String (options: (AU | CA | FR | DE | HK | US | IT | ES | GB | IN))
* * lang: String (options:  (en | fr | de | it | es | zh))

// 1. Loop through all queries in pluginOptions
// 2. Ensure that the required values are filled out for each query
// 3. Throw errors if required fields are missing
// 4. Initiate each query
// 5. Catch query error, and throw customized error
// 6. Create  nodes from the response using a shared helper function
// 7. Display errors if found
// 8. Convert to Typescript
// 9. Add README


*/
