// eslint-disable
// this is an auto generated file. This will be overwritten

export const createCoin = `mutation CreateCoin(
  $id: String!
  $name: String!
  $symbol: String!
  $price_usd: String!
) {
  createCoin(id: $id, name: $name, symbol: $symbol, price_usd: $price_usd) {
    id
    name
    symbol
    price_usd
  }
}
`;
