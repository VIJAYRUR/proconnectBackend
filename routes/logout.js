const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { auth } = require("./auth");
const { Professional_Profile, Student_Profile } = require("./DB/profiles_db");
const { Scheduled_Request } = require("./DB/scheduled_request_db");
const { Student_Request } = require("./DB/request_db.js");
const { Feedback, feedback_connectDB } = require("./DB/feedback_db.js");

router.get("/logout", (req, res) => {
  const check = auth(req);
  if (check.isLoggedin == false) {
    return res.status(400).end("You must login before logging out");
  }
  //   res.clearCookie(); after connecting with front end
  res.status(200).end("logged out succesfully");
});

module.exports = router;
