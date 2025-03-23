import createError from "http-errors";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { getAuctionById } from "./getAuction.js";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3.js";

export async function uploadAuctionPicture(event, context) {

  // {{AUCTIONS_HOST}}/auction/{{id}}/picture
  const { id } = event.pathParameters;
  // const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);
  
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  try {
    const uploadResult = await uploadPictureToS3(auction.id + ".jpg", buffer);
    console.log('uploadResult', uploadResult);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "uploadAuctionPicture success!" }),
      // image: result,
    };
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = middy(uploadAuctionPicture).use(httpErrorHandler());
