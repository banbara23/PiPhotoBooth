// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');

// Your Google Cloud Platform project ID
const projectId = 'banbara-studio';

// Instantiates a client
const storageClient = Storage({
  projectId: projectId
});

// The name for the new bucket
const bucketName = 'my-new-bucket';

// Creates the new bucket
storageClient.createBucket(bucketName)
  .then((results) => {
    const bucket = results[0];
    console.log(`Bucket ${bucket.name} created.`);
  })
  .catch((error) => {
    console.log(error);
  });