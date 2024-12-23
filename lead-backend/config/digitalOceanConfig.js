const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('https://lara.blr1.digitaloceanspaces.com'), 
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
});

module.exports = s3;
