const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../model/users");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/all_users", (req, res) =>
  User.find().then((users) => {
    res.send(users);
  })
);

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      errors.Registeremail = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              let name = user.name;
              let email = user.email;
              let password = req.body.password;
              let phone = user.phone;

              var transporter = nodemailer.createTransport(
                smtpTransport({
                  service: "gmail",
                  host: "smtp.gmail.com",
                  auth: {
                    user: "codefunzz@gmail.com",
                    pass: "9966599303",
                  },
                })
              );

              var mailOptions = {
                from: "codefunzz@gmail.com",
                to: email,
                subject: "School Management Registeration Details.",
                html: `<p>Hi ${name}<p>
                      <p> Thanks For Registering In The School Management.Below Are The Following Credentials Details</p>
                       <ul>
                       <li>UserName : ${email}</li>
                       <li>PassWord : ${password}</li>
                       <li>Phone Number : ${phone}</li>
                       </ul>
                      <p>Please Use The Above Credentials To Login Into The School Management.<p>
                      <p> If You Have Any Queries Please Feel Free To Contact Us On<p> <a href="mailto:b.waseem.403@gmail.com">schoolsupport@gmail.com</a>
                       <h5><strong>Regards</strong><h5>
                       <p> School Management.<p>
                       `,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  throw error;
                } else {
                  res
                    .status(200)
                    .send(
                      `Register successfully! confirmation Email is sent to ${req.body.email}`
                    );
                }
              });
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({
    email,
  }).then((user) => {
    // Check for user
    if (!user) {
      errors.loginemail = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User Matched
        // const avatarimg = user.useravatar ?
        //   user.useravatar :
        //   "https://firebasestorage.googleapis.com/v0/b/userprofile-94657.appspot.com/o/images%2F0d1f66df-34e1-4ee2-a827-51ca6cb84015.png?alt=media&token=30eae647-d868-4bc6-88d3-1b47530b8e57";

        const payload = {
          id: user.id,
          name: user.name,
          // avatar: avatarimg
        }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        errors.loginpassword = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.useravatar,
    });
  }
);

module.exports = router;
