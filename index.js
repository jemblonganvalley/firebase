const express = require("express");
const cors = require("cors");
const user = require("./routes/user_routes");
const biodata = require("./routes/biodata_routes");
const upload = require("./routes/upload_routes");
const product = require("./routes/product_routes");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));

app.use("/api", user);
app.use("/api", biodata);
app.use("/api", upload);
app.use("/api", product);

app.listen(PORT, () => {
  console.log(`listen port ${PORT}`);
});
