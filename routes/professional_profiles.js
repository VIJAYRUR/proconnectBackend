const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { auth } = require("./auth");
const { Professional_Profile, Student_Profile } = require("./DB/profiles_db");
const { Scheduled_Request } = require("./DB/scheduled_request_db");
const { Student_Request } = require("./DB/request_db.js");

router.post("/make_professional_profile", async (req, res) => {
  const check = auth(req);
  if (check.isLoggedin == false || check.role == "student") {
    return res.status(400).json({
      message: "User is not Logged In or not authorized to access this",
    });
  }
  const req_skills = req.body.skills;
  const req_universityname = req.body.universityname;
  const req_yearsofexperience = req.body.yearsofexperience;
  const req_currentlyworking = req.body.currentlyworking;
  const req_currentrole = req.body.currentrole;
  const req_origin = req.body.origin;
  const req_linkedin = req.body.linkedin;
  try {
    console.log(check.email + " " + check.username);
    const new_profile = new Professional_Profile({
      username: check.username,
      email: check.email,
      universityname: req_universityname,
      yearsofexperience: req_yearsofexperience,
      currentlyworking: req_currentlyworking,
      currentrole: req_currentrole,
      origin: req_origin,
      skills: req_skills,
      linkedin: req_linkedin,
    });
    console.log(new_profile);
    const deletedUser = await Professional_Profile.findOneAndDelete({
      username: check.username,
    });
    if (deletedUser) {
      await new_profile.save();
      return res.status(200).end("Profile Edited successfully");
    } else {
      await new_profile.save();
      return res.status(200).end("Profile Added successfully");
    }
  } catch (e) {
    res.status(400).end("Profile creating failed" + e);
  }
});

router.get("/view_professional_profile", async (req, res) => {
  const check = auth(req);
  const get_user = await Professional_Profile.findOne({
    username: check.username,
  });
  res.status(200).json(get_user);
});

module.exports = router;
