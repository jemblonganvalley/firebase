const { default: firebase } = require("firebase");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

// FIREBASE CONFIG
var firebaseConfig = {
  apiKey: "AIzaSyBhoT_QjcUFgpHzYyBOTDRJGl1wg1ptoHM",
  authDomain: "projectfadli-23bb9.firebaseapp.com",
  projectId: "projectfadli-23bb9",
  storageBucket: "projectfadli-23bb9.appspot.com",
  messagingSenderId: "456267130908",
  appId: "1:456267130908:web:c848b72b39dcf65ae717d9",
};

// INNITIALISASI PROJECT
const fire = firebase.initializeApp(firebaseConfig);

// PENGGUNAAN FIRESTORE
const db = fire.firestore();

//PENGGUNAAN FIREBASE STORAGE
const g_storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "../projectfadli-23bb9-firebase-adminsdk-k5duk-61e02368de.json"
  ),
});

const bucket_name = "projectfadli-23bb9.appspot.com";
const product_storage = g_storage.bucket(bucket_name);

module.exports = { db, product_storage };
