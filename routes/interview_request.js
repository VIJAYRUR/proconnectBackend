// porting login route
const express = require("express");
const jwt = require("jsonwebtoken");
const { auth } = require("./auth");
const { Student_Profile } = require("./DB/profiles_db");
const { Student_Request } = require("./DB/request_db");
const router = express.Router();

router.post("/make_request", async (req, res) => {
  const check = auth(req);
  if (check.isLoggedin == false || check.role == "professional") {
    return res
      .status(400)
      .end("your not Logged in or you are not allowed to acces this page ");
  }
  try {
    const req_username = check.username;
    const req_email = check.email;
    const req_skills = req.body.skills; // Array of skills
    const req_depth_of_knowledge = req.body.depth_of_knowledge;
    const req_company_target = req.body.company_target;
    const req_origin_target = req.body.origin_target;

    const verify_active_request_from_users = await Student_Request.findOne({
      username: req_username,
    });
    if (verify_active_request_from_users != null) {
      return res
        .status(400)
        .end("you have aldready have a active request, please wait");
    }
    const req_getstudent = await Student_Profile.findOne({
      username: req_username,
      email: check.email,
    });
    // console.log(json(req_getstudent));
    const new_request = new Student_Request({
      username: req_username,
      email: req_email,
      university: req_getstudent.university,
      course: req_getstudent.universitycourse,
      CGPA: req_getstudent.universitycgpa,
      passoutdate: req_getstudent.passoutdate,
      skills_to_be_questioned: req_skills,
      depth_of_knowledge: req_depth_of_knowledge,
      company_target: req_company_target,
      origin_target: req_origin_target,
    });
    await new_request.save();
    return res.status(200).json(req_getstudent);
  } catch (e) {
    res
      .status(400)
      .end("request can't be made, make your profile and try again " + e);
  }
});

router.get("/active_requests", async (req, res) => {
  const check = auth(req);
  if (check.isLoggedin == false || check.role == "professional") {
    return res
      .status(400)
      .end("Your must be Logged in or Your not allowed to access this page");
  }
  try {
    const get_request = await Student_Profile.findOne({
      username: check.username,
      email: check.email,
    });
    if (get_request) {
      res.status(200).json(get_request);
    } else {
      res.status(200).end("you donot have any active requests");
    }
  } catch (e) {
    res.status(400).end("please try again later " + e);
  }
});

router.delete("/delete_active_request", async (req, res) => {
  const check = auth(req);
  console.log(check.isLoggedin + " " + check.role);
  if (check.isLoggedIn == false || check.role == "professional") {
    return res
      .status(400)
      .end("your not logged in or your not allowed to perform this action");
  }
  try {
    const delete_result = await Student_Request.findOneAndDelete({
      username: check.username,
      email: check.email,
    });
    if (delete_result) {
      res.status(200).end("You have successfully deleted the active request");
    } else {
      res.status(400).end("they are no active requests");
    }
  } catch (e) {
    res.status(400).end("please try again later");
  }
});

module.exports = router;
