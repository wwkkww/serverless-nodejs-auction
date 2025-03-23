import AWS from "aws-sdk";
import createError from "http-errors";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import commonMiddleware from "../lib/commonMiddleware.js";
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema.js";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  // console.log("event", event.requestContext);
  // const { email } = event.requestContext.authorizer;  
  let auctions;

  let params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };
  try {
    const results = await dynamodb.query(params).promise();

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

// export const handler = commonMiddleware(getAuctions).use(
//   validator({
//     inputSchema: getAuctionsSchema,
//     ajvOptions: {
//       useDefaults: true,
//       strict: false,
//     },
//   })
// );

export const handler = commonMiddleware(getAuctions).use(
  validator({
    eventSchema: transpileSchema(getAuctionsSchema),
  })
);
