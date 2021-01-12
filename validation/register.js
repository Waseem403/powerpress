const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";

  if (!Validator.isLength(data.name, { min: 2, max: 15 })) {
    errors.name = "Name must be between 2 and 15 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.Registeremail = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.Registeremail = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.Registerpassword = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.Registerpassword = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  } else {
    if (!Validator.equals(data.password, data.password2)) {
      errors.Registerpassword2 = "Passwords must match";
    }
  }
  if (Validator.isEmpty(data.phone)) {
    errors.Registerphone = "phone number is required";
  }
  if (!Validator.isLength(data.phone, { min: 10, max: 11 })) {
    errors.Registerphone = "Please enter a valid mobile number";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
