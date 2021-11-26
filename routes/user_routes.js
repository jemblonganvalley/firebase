const express = require("express");
const user = express.Router();
const { db } = require("../model/fire");

//CREATE USER
user.post("/user_create", (req, res) => {
  
  const data = req.body;

  db.collection("users")
    .doc(data.email)
    .set(data)
    .then((snapshot) => {
      res.status(201).json({
        success: true,
        data: data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
      });
    });
});

//READ USER
user.get("/user_read", (req, res) => {
  let user = [];
  let biodata = []

  db.collection("users").get()
  .then(record =>{
    record.forEach((e) => {
      user.push(e.data())
    })
  })
  .catch(error =>{
    res.status(500).json(error)
  })

  db.collection("biodata").get()
  .then(record =>{
    record.forEach((e)=>{
      biodata.push(e.data())
    })
    res.status(200).json(user.map((e)=>{
      return {
        email : e.email,
        biodata : biodata.find((x)=>{ return x.email == e.email })
      }
    }))
  })

  // db.collection("users")
  //   .orderBy("email", "desc")
  //   .get()
  //   .then((result) => {
  //     result.forEach((e) => {
  //       user.push(e.data());
  //     });

  //     res.status(200).json(user);
  //   })
  //   .catch((error) => {
  //     res.status(500).json(error);
  //   });
});

//UPDATE
user.put("/user_update", (req, res) => {
  const data = req.body;
  db.collection("users")
    .doc(data.email)
    .update(data)
    .then((result) => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
      });
    });
});

//DELETE
user.delete("/user_delete", (req, res) => {
  const data = req.body;
  db.collection("users")
    .doc(data.email)
    .delete()
    .then((result) => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
      });
    });
});

//FIND USER
user.get("/user_find", (req, res) => {
  const filter = req.body;
  let objFilter = Object.keys(filter);
  let objVal = Object.values(filter);
  let data = [];

  db.collection("users")
    .where(`${objFilter[0]}`, "==", `${objVal[0]}`)
    .get()
    .then((result) => {
      result.forEach((e) => {
        data.push(e.data());
      });

      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).send("error");
    });
});

module.exports = user;
