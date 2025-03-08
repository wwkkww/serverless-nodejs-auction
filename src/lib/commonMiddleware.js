import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";


export default handler => middy(handler)
  .use([
    httpJsonBodyParser(), // automatically parses HTTP requests with a JSON body and converts the body into an object
    httpEventNormalizer(), // normalizes the API Gateway making sure that an object for the request is always available at event.body
    httpErrorHandler() // Automatically handles uncaught errors
  ]);