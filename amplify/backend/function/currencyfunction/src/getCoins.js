const AWS = require('aws-sdk')
const region = process.env.REGION
var storageCurrencytableName = process.env.STORAGE_CURRENCYTABLE_NAME
const params = {
  TableName: storageCurrencytableName
}
var docClient = new AWS.DynamoDB.DocumentClient({region})

AWS.config.update({ region })

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