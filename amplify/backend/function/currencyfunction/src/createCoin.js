const AWS = require('aws-sdk')
const uuid = require('uuid/v4')
const region = process.env.REGION
const ddb_table_name = process.env.STORAGE_CURRENCYTABLE_NAME
const docClient = new AWS.DynamoDB.DocumentClient({region})

function write(params, event, callback){
  docClient.put(params, function(err, data) {
    if (err) {
      callback(err)
    } else {
      callback(null, event.arguments)
    }
  })
}

function createCoin(event, callback) {
  const args = { ...event.arguments, id: uuid() }
  var params = {
    TableName: ddb_table_name,
    Item: args
  };
  
  if (Object.keys(event.arguments).length > 0) {
    write(params, event, callback)
  } 
}

module.exports = createCoin