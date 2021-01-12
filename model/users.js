const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Userschema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  password2: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  resetPasswordToken: String,
  useravatar: String,
  resetPasswordExpires: Date
});

module.exports = User = mongoose.model("users", Userschema);
