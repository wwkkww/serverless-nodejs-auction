import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";


const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const body = JSON.parse(event.body);
  const auction = { 
    id: uuid(),
    title: body.title, 
    status: "OPEN", 
    createdAt: new Date().toISOString() 
  };

  await dynamodb.put({
    // TableName: process.env.AUCTIONS_TABLE_NAME,
    TableName: 'AuctionsTable',
    Item: auction
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
