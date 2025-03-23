import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";
import validator from "@middy/validator";
import { transpileSchema } from '@middy/validator/transpile'
import commonMiddleware from "../lib/commonMiddleware.js";
import createAuctionSchema from "../lib/schemas/createAuctionSchema.js";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  // ** handle by httpJsonBodyParser
  // const body = JSON.parse(event.body);
  const body = event.body;
  console.log("event", event.requestContext);
  const { email } = event.requestContext.authorizer; 

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
    },
    seller: email,
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

// export const handler = commonMiddleware(createAuction);

export const handler = commonMiddleware(createAuction).use(
  validator({
    eventSchema: transpileSchema(createAuctionSchema)
  })
);