import createError from "http-errors";

async function uploadAuctionPicture(event, context) {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "uploadAuctionPicture success!" }),
    };
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = uploadAuctionPicture;
