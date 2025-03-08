import AWS from "aws-sdk";
import createError from "http-errors";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
// import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  let auction;
  const { id } = event.pathParameters;
  console.log("event: ", event);
  console.log("id: ", id);
  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    console.log("result: ", result);
    auction = result.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Error: Auction with ID "${id}" not found.`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(getAuction).use([
  httpJsonBodyParser(), // automatically parses HTTP requests with a JSON body and converts the body into an object
  httpEventNormalizer(), // normalizes the API Gateway making sure that an object for the request is always available at event.body
  httpErrorHandler(), // Automatically handles uncaught errors
]);
