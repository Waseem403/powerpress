const express = require("express");
const bodyParser = require("body-parser");

//Init express app
const app = express();

// Body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get("/test", (req, res) => {
  res.json({ msg: "testing..." });
});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server running on port ${port}`));
