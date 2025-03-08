import AWS from "aws-sdk";
import createError from "http-errors";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
// import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;

  try {
    const results = await dynamodb
      .scan({ TableName: process.env.AUCTIONS_TABLE_NAME })
      .promise();

    auctions = results.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middy(getAuctions).use([
  httpJsonBodyParser(), // automatically parses HTTP requests with a JSON body and converts the body into an object
  httpEventNormalizer(), // normalizes the API Gateway making sure that an object for the request is always available at event.body
  httpErrorHandler(), // Automatically handles uncaught errors
]);