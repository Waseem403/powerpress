const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Users = require("./Db/Users.json");
const users = require("./routes/api/users");

//Init express app
const app = express();

// Body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected To MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/users", users);

app.get("/Users", (req, res) => {
  res.json(Users);
});

app.post("/Register_Users", (req, res) => {
  res.send("user is regsiter successfully...");
});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server running on port ${port}`));
