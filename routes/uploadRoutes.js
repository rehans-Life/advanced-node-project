const { Router } = require("express");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

const router = Router();
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: "ap-southeast-1",
});

router.get("/", requireLogin, async (req, res) => {
  const key = `${req.user.id}/${uuidv4()}.png`;

  const params = {
    Bucket: "blogs-bucket-123",
    Key: key,
    ContentType: req.query.type,
    Expires: 100000,
  };
  const url = s3.getSignedUrl("putObject", params);

  return res.status(200).send({
    key,
    url,
  });
});

module.exports = router;
