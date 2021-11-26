const biodata = require("express").Router();
const { db } = require("../model/fire");

// CREATE
biodata.post("/biodata_create", async (req, res) => {
  const data = await req.body
  const em = await []
  const check = await db.collection("biodata")

  check.where("email", "==", data.email).get()
  .then(record =>{
    if(record.size){
      res.status(201).json({
        success : false,
        msg : "data sudah ada"
      })
    }else{
      check.add(data)
      res.status(201).send({
        success : true,
        msg : "data berhasil dimasukan"
      })
    }
  })
  
  
  
});

//READ
biodata.get("/biodata_read", async (req, res) => {
  try {
    const colData = await [];
    const result = await db.collection("biodata").get();
    const psh = await result.forEach((element) => {
      colData.push(element.data());
    });

    res.status(200).json(colData);
  } catch (error) {
    res.status(404).json({ success: error });
  }
});

module.exports = biodata;
