# AWS AppSync - Lambda GraphQL Resolver Examples

## Resources in this project

```sh
~ amplify status

Current Environment: local

| Category | Resource name    | Operation | Provider plugin   |
| -------- | ---------------- | --------- | ----------------- |
| Storage  | currencytable    | No Change | awscloudformation |
| Function | currencyfunction | No Change | awscloudformation |
| Api      | gqllambdacrypto  | No Change | awscloudformation |
```

### API - AWS AppSync (GraphQL)

#### Schema

This schema has 1 main type (`Coin`) as well as `Query` and a `Mutation` operation to interact with the type. The resolver for these operations is the Lambda function (`currencyfunction`).

```graphql
type Coin {
  id: String!
  name: String!
  symbol: String!
  price_usd: String!
}

type Query {
  getCoins(limit: Int start: Int): [Coin] @function(name: "currencyfunction-${env}")
}

type Mutation {
  createCoin(name: String! symbol: String! price_usd: String!): Coin @function(name: "currencyfunction-${env}")
}
```

### Function - AWS Lambda

The Function has two main features: 

1. Fetch from a REST API and return the results.

2. Interact with a DynamoDB Table (putItem and Scan)

#### index.js

```javascript
// index.js
const axios = require('axios')

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
```

#### getCoins.js

```javascript
// getCoins.js
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
```

#### createCoin.js

```javascript
// createCoin.js
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
```

### Storage - Amazon DynamoDB

This table has the following properties:

- id
- name
- symbol
- price_usd

## Deploy this app

__To deploy this project, you can do one of the following:__

### 1. Use the AWS Amplify 1-click deploy button

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/dabit3/lambda-graphql-resolver-examples)

### 2. Deploy from your local machine

1. Clone the repo

```sh
git clone https://github.com/dabit3/lambda-graphql-resolver-examples.git

cd lambda-graphql-resolver-examples
```

2. Install dependencies

```sh
npm install
```

3. Initialize new Amplify repository

```sh
amplify init
```

4. Deploy

```sh
amplify push
```