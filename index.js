// Library imports
const express = require("express");
const cors = require("cors");

// Route imports
const rootRoute = require("./routes/rootRoute");

// utils imports
const connect = require("./db/connectToDB");


const app = express();

const port = process.env.PORT || 3000;


// middlewares
app.use(express.json());
app.use(cors());

// database connection
connect();

// routes
app.use("/api", rootRoute);

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
