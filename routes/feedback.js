const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { auth } = require("./auth");
const { Professional_Profile, Student_Profile } = require("./DB/profiles_db");
const { Scheduled_Request } = require("./DB/scheduled_request_db");
const { Student_Request } = require("./DB/request_db.js");
const nodemailer = require("nodemailer");
const { Feedback, feedback_connectDB } = require("./DB/feedback_db.js");

router.post("/provide_feedback", async (req, res) => {
  const check = auth(req);
  if (check.isLoggedin == false && check.role == "student") {
    return res
      .status(400)
      .end("Please log in or your not allowed to access this page");
  }
  try {
    const req_interviewer_name = req.body.interviewer_name;
    const req_student_name = req.body.student_name;
    const req_interviewer_email = req.body.interviewer_email;
    const req_student_email = req.body.student_email;
    const req_message = req.body.message;
    const req_date = req.body.date;
    const req_time = req.body.time;

    const new_feedback = new Feedback({
      interviewer_name: req_interviewer_name,
      student_name: req_student_name,
      interviewer_email: req_interviewer_email,
      student_email: req_student_email,
      message: req_message,
      date: req_date,
      time: req_time,
    });
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "proconnect522@gmail.com",
        pass: "dkdb mhxd vgxt dabg",
      },
    });
    const mailOptions1 = {
      from: "proconnect522@gmail.com",
      to: [req_student_email],
      subject: "Interview Meeting Link",
      text: `you have received a feedback from the interviewer ${req_interviewer_email} `,
    };
    try {
      await transporter.sendMail(mailOptions1);
      console.log("successs");
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "please try again later" });
    }

    await new_feedback.save();
    const del_data = await Scheduled_Request.deleteOne({
      interviewer_name: req_interviewer_name,
      student_name: req_student_name,
      date: req_date,
      time: req_time,
    });
    res.status(200).end("feedback sent");
  } catch (e) {
    return res.status(400).end("please try again later " + e);
  }
});

router.get("/student_history", async (req, res) => {
  const check = auth(req);
  if (check.isLoggedin == false || check.role == "professional") {
    return res
      .status(400)
      .end("Please log in or your not allowed to access this page");
  }
  try {
    const history = await Feedback.find({ student_name: check.username });
    return res.status(200).json(history);
  } catch (e) {
    return res.status(400).end("please try again later" + e);
  }
});

router.get("/professional_history", async (req, res) => {
  const check = auth(req);

  if (check.isLoggedin == false || check.role == "student") {
    return res
      .status(400)
      .end("Please log in or your not allowed to access this page");
  }
  try {
    const history = await Feedback.find({ interviewer_name: check.username });
    return res.status(200).json(history);
  } catch (e) {
    return res.status(400).end("please try again later" + e);
  }
});

module.exports = router;
