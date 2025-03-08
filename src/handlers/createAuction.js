import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
// import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  // ** handle by httpJsonBodyParser
  // const body = JSON.parse(event.body);
  const body = event.body;

  const auction = {
    id: uuid(),
    title: body.title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
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

export const handler = middy(createAuction).use([
  httpJsonBodyParser(), // automatically parses HTTP requests with a JSON body and converts the body into an object
  httpEventNormalizer(), // normalizes the API Gateway making sure that an object for the request is always available at event.body
  httpErrorHandler(), // Automatically handles uncaught errors
]);
