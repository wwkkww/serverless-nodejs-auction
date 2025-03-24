import createError from "http-errors";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { getAuctionById } from "./getAuction.js";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3.js";
import { setAuctionPictureUrl } from "../lib/setAuctionPictureUrl.js";

export async function uploadAuctionPicture(event, context) {

  // {{AUCTIONS_HOST}}/auction/{{id}}/picture
  const { id } = event.pathParameters;
  // const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);
  
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  let updatedAuction;
  try {
    const picUrl = await uploadPictureToS3(auction.id + ".jpg", buffer);
    console.log('picUrl', picUrl);
    updatedAuction = await setAuctionPictureUrl(auction.id, picUrl);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middy(uploadAuctionPicture).use(httpErrorHandler());
