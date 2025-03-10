import createError from "http-errors";
import { getEndedAuctions } from "../lib/getEndedAuctions.js";
import { closeAuction } from "../lib/closeAuction.js";

async function processAuctions (event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();
    console.log("auctionsToClose 💗", auctionsToClose);
  
    const closePromises = auctionsToClose.map((auction) =>  closeAuction(auction));
    await Promise.all(closePromises);

    return { closed: closePromises.length }
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }
}


export const handler = processAuctions;