const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { auth } = require("./auth");
const { Professional_Profile, Student_Profile } = require("./DB/profiles_db");
const { Scheduled_Request } = require("./DB/scheduled_request_db");
const { Student_Request } = require("./DB/request_db.js");

router.get("/view_student_schedule", async (req, res) => {
  const check = auth(req);
  if (check.isLoggedin == false || check.role == "professional") {
    return res
      .status(400)
      .end(
        "Make sure your are Logged In else your not allowed to access this page"
      );
  }
  try {
    const result = await Scheduled_Request.findOne({
      student_name: check.username,
    });
    return res.status(200).json([result]);
  } catch (e) {
    return res.status(400).end("please try again later");
  }
});

router.get("/view_interviewer_schedule", async (req, res) => {
  const check = auth(req);
  if (check.isLoggedin == false || check.role == "student") {
    return res
      .status(400)
      .end(
        "Make sure your are Logged In else your not allowed to access this page"
      );
  }
  try {
    const result = await Scheduled_Request.find({
      interviewer_name: check.username,
    });
    console.log(result);
    const arr = [];
    return res.status(200).json([result]);
  } catch (e) {
    return res.status(400).end("please try again later");
  }
});

module.exports = router;
