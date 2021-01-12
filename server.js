const express = require("express");
const bodyParser = require("body-parser");

const Users = require("./Db/Users.json");

//Init express app
const app = express();

// Body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get("/Users", (req, res) => {
  res.json(Users);
});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server running on port ${port}`));
