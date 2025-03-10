import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware.js";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  // ** handle by httpJsonBodyParser
  // const body = JSON.parse(event.body);
  const body = event.body;

  const endDate = new Date();
  // endDate.setDays(endDate.getDays() + 1); // end bid after 1 day
  endDate.setHours(endDate.getHours() + 1); // end bid after 1 hour
  const auction = {
    id: uuid(),
    title: body.title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    }
  };

  try {
    await dynamodb
      .put({
        // TableName: process.env.AUCTIONS_TABLE_NAME,
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction);