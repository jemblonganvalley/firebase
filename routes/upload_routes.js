const upload = require("express").Router();
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const multer = require("multer");
const { db, file_storage } = require("../model/fire");

const mulStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../photo"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});

const up = multer({ storage: mulStorage });

const uploadFile = async (file, name) => {
  await file_storage.upload(file, {
    destination: `fadliselaz/${name}`,
    gzip: true,
    metadata: {
      metadata: {
        cacheControl: "public, max-age=31536000",
        firebaseStorageDownloadTokens: process.env.IMAGE_TOKEN,
      },
    },
  });
};

upload.post("/upload_create", up.single("photo"), async (req, res) => {
  const file = await req.file;
  const data = await req.body;

  await uploadFile(
    path.join(__dirname, `../photo/${file.filename}`),
    file.filename
  )
    .then(() => {
      fs.unlink(path.join(__dirname, `../photo/${file.filename}`), () => {
        return;
      });
      db.collection("users")
        .doc(data.email)
        .update({
          avatar: {
            url: `https://firebasestorage.googleapis.com/v0/b/projectfadli-23bb9.appspot.com/o/fadliselaz%2F${file.filename}?alt=media&token=${process.env.IMAGE_TOKEN}`,
          },
        })
        .then((result) => {
          res.status(201).json({
            success: true,
          });
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
      });
    });
});

module.exports = upload;
