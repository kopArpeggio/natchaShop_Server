const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const Routes = require("./routes/Routes");
const errorHandler = require("./middleware/errorHandler");

app.use("/api", Routes);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

app.use(errorHandler);
