import AWS from "aws-sdk";

const s3 = new AWS.S3();

export async function uploadPictureToS3(key, pictureBuffer) {
  
  const result = await s3.upload({
      Bucket: process.env.AUCTIONS_BUCKET_NAME,
      Key: key,
      Body: pictureBuffer,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    })
    .promise();

  // result: {
  //   Expiration: 'expiry-date="Tue, 25 Mar 2025 00:00:00 GMT", rule-id="ExpirePictures"',
  //   ETag: '"1b12272bf2ff618e9f95df3cc98c3871"',
  //   ServerSideEncryption: 'AES256',
  //   Location: 'https://sls-auctions-bucket-wwkkww-dev.s3.ap-southeast-1.amazonaws.com/3d95dfd8-0348-4541-86db-635da94821c6.jpg',
  //   key: '3d95dfd8-0348-4541-86db-635da94821c6.jpg',
  //   Key: '3d95dfd8-0348-4541-86db-635da94821c6.jpg',
  //   Bucket: 'sls-auctions-bucket-wwkkww-dev'
  // }
  return result.Location;
}