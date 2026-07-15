require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.uploader.upload('/tmp/dummy.jpg', function(error, result) {
  if(error) {
    console.error(JSON.stringify(error, null, 2));
  } else {
    console.log(result);
  }
});
