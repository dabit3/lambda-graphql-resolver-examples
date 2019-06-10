var AWS = require('aws-sdk')
var uuid = require('uuid/v4')
var region = process.env.REGION
var DBTable = process.env.STORAGE_CURRENCYTABLE_NAME
AWS.config.update({region: region});
var ddb_table_name = DBTable

var docClient = new AWS.DynamoDB.DocumentClient({region});

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