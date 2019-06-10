/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageCurrencytableName = process.env.STORAGE_CURRENCYTABLE_NAME
var storageCurrencytableArn = process.env.STORAGE_CURRENCYTABLE_ARN

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
const axios = require('axios')
const region = process.env.REGION

AWS.config.update({ region })

const getCoins = require('./getCoins')
const createCoin = require('./createCoin')

exports.handler = function (event, _, callback) {
  // uncomment to invoke DynamoDB with putItem or Scan
  // if (event.typeName === 'Mutation') {
  //   createCoin(event, callback)
  // }
  // if (event.typeName === 'Query') {
  //   getCoins(callback)
  // }
  
  // call another API and return the response (query only)
  let apiUrl = `https://api.coinlore.com/api/tickers/?start=1&limit=10`

  if (event.arguments) { 
    const { start = 0, limit = 10 } = event.arguments
    apiUrl = `https://api.coinlore.com/api/tickers/?start=${start}&limit=${limit}`
  }
  
  axios.get(apiUrl)
    .then(response => callback(null, response.data.data))
    .catch(err => callback(err))
}