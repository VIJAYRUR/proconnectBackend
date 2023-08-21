const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { auth } = require("./auth");
const { Student_Profile } = require("./profiles_db");

router.post("/make_student_profile", async (req, res) => {
  const check = auth(req);
  if (!check.isLoggedin || check.role === "professional") {
    return res.status(400).json({
      message: "User is not Logged In or not authorized to access this",
    });
  }
  const req_skills = req.body.skills;
  const req_universityname = req.body.universityname;
  const req_universitycourse = req.body.universitycourse;
  const req_universitycgpa = req.body.universitycgpa;
  const req_passoutdate = req.body.passoutdate;
  try {
    const new_profile = new Student_Profile({
      username: check.username,
      email: check.email,
      university: req_universityname,
      universitycourse: req_universitycourse,
      universitycgpa: req_universitycgpa,
      passoutdate: req_passoutdate,
      skills: req_skills,
    });
    await new_profile.save();
    return res.status(200).end("Profile Added successfully");
  } catch (e) {
    res.status(400).end("Profile creating failed");
  }
});

router.get("/view_student_profile", async (req, res) => {
  const check = auth(req);
  const get_user = await Student_Profile.findOne({ username: check.username });
  res.status(200).json(get_user);
});

module.exports = router;
