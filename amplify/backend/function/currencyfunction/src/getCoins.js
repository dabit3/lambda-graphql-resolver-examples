const AWS = require('aws-sdk')
const region = process.env.REGION
const storageCurrencytableName = process.env.STORAGE_CURRENCYTABLE_NAME
const docClient = new AWS.DynamoDB.DocumentClient({region})

const params = {
  TableName: storageCurrencytableName
}

function getCoins(callback) {
  docClient.scan(params, function(err, data) {
    if (err) {
      callback(err)
    } else {
      callback(null, data.Items)
    }
  });
}

module.exports = getCoins