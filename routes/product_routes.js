const { product_storage, db } = require("../model/fire");
const { upload_product } = require("../services/multer");
require("dotenv").config();
const path = require("path");
const { uuid } = require("uuid");
const { json } = require("express");

const product = require("express").Router();

// CREATE
product.post("/product_create", upload_product.single("photo"), (req, res) => {
  const data = req.body;
  const file = req.file;

  product_storage
    .upload(path.join(__dirname, `../photo/product/${file.filename}`), {
      destination: `products/${file.filename}`,
      gzip: true,
      metadata: {
        metadata: {
          cacheControl: "public, max-age=31536000",
          firebaseStorageDownloadTokens: process.env.IMAGE_TOKEN,
          fileName: file.filename,
        },
      },
    })
    .then(() => {
      db.collection("products")
        .add({
          id: uuid(),
          name: data.name,
          price: data.price,
          qty: data.qty,
          status: data.status,
          photo: {
            url: `https://firebasestorage.googleapis.com/v0/b/projectfadli-23bb9.appspot.com/o/products%2F${file.filename}?alt=media&token=${process.env.IMAGE_TOKEN}`,
            photo_name: file.filename,
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
    .catch((error) => {
      res.status(500).json(error);
    });
});

// READ
product.get("/product_read", (req, res) => {
  let data = [];
  db.collection("products")
    .get()
    .then((result) => {
      result.forEach((e) => {
        data.push(e.data());
      });
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// DELETE
product.delete("/product_delete", (req, res) => {
  const data = req.body;
  const collection = [];

  //dapatkan data dari doc
  db.collection("products")
    .doc(data.doc)
    .get()
    .then(async (result) => {
      try {
        //delete document
        const delDoc = await db.collection("products").doc(data.doc).delete();

        //delete photo
        const delPhoto = await product_storage
          .file(`products/${result.data().photo.photo_name}`)
          .delete();

        //response
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ success: false, error: error });
      }
    })
    .catch((error) => {
      res.status(500), json(error);
    });
});

// UPDATE
product.put("/product_update", upload_product.none(), (req, res) => {
  const data = req.body;
  db.collection("products")
    .doc(data.doc)
    .update({
      name: data.name,
      price: data.price,
      qty: data.qty,
      status: data.status,
    })
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error });
    });
});

//FIND
product.get("/product_find", (req, res) => {
  const { filter } = req.body;
  let collection = [];
  db.collection("products")
    .where(filter.key, "==", filter.value)
    .get()
    .then((result) => {
      result.forEach((item) => {
        collection.push(item.data());
      });
      res.status(200).json(collection);
    });
});

module.exports = product;
