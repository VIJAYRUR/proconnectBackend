const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { auth } = require("./auth");
const { Professional_Profile, Student_Profile } = require("./DB/profiles_db");
const { Scheduled_Request } = require("./DB/scheduled_request_db");
const { Student_Request } = require("./DB/request_db.js");

router.get("/view_all_request", async (req, res) => {
  const check = auth(req);
  if (check.isLoggedin == false || check.role == "student") {
    return res
      .status(401) // Unauthorized
      .end("You might be logged out or you're not allowed to access this page");
  }
  try {
    const get_professional = await Professional_Profile.findOne({
      username: check.username,
    });
    if (!get_professional) {
      return res.status(401).end("make your profile first");
    }

    const get_professional_skills = get_professional.skills;
    const matched_result = [];

    const data = await Student_Request.find();
    data.forEach((i) => {
      const get_requirement_skills = i.skills_to_be_questioned;
      let length = 0;
      var count = 0;
      console.log(get_requirement_skills);
      console.log(get_professional_skills)
      for (const skill of get_professional_skills) {
        length++;
        if (get_requirement_skills.includes(skill.trim())) {
          count++;
        }
      }
      console.log(length);     
        let temp = [];
        temp.push((count / length) * 100);
        temp.push(i);
        matched_result.push(temp);
     
    });
    console.log(matched_result);
    return res.json([matched_result]);
  } catch (e) {
    console.log(e);
    return res.status(500).end("Please try again later" + e);
  }
});

router.post("/connect_to_request", async (req, res) => {
  function generateUniqueMeetLink() {
    return `https://meet.google.com/${uuidv4()}`;
  }
  const check = auth(req);
  console.log(check);
  if (check.isLoggedin == false && check.role == "student") {
    return res
      .status(400)
      .end("Your logged out or not allowed to access this page");
  }
  try {
    const req_interviewer_name = check.username;
    const req_student_name = req.body.studentname;
    const req_date = req.body.date;
    const req_time = req.body.time;

    const verify_schedule = await Scheduled_Request.findOne({
      interviewer_name: req_interviewer_name,
      date: req_date,
      time: req_time,
    });

    if (verify_schedule) {
      return res
        .status(400)
        .end("You have a scheduled interview at the same time selected");
    }

    const get_interviewer = await Professional_Profile.findOne({
      username: check.username,
    });
    const get_student = await Student_Profile.findOne({
      username: req_student_name,
    });

    const googleMeetLink = generateUniqueMeetLink();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "proconnect522@gmail.com",
        pass: "dkdb mhxd vgxt dabg",
      },
    });

    const mailOptions = {
      from: "proconnect522@gmail.com",
      to: [get_interviewer.email, get_student.email],
      subject: "Interview Meeting Link",
      text: `You have an interview scheduled on ${req_date} at ${req_time}. Here is the Google Meet link: ${googleMeetLink} interviewer email:- ${get_interviewer.email}`,
    };
    const mailOptions2 = {
      from: "proconnect522@gmail.com",
      to: [get_interviewer.email, get_student.email],
      subject: "Interview Meeting Link",
      text: `You have an interview scheduled on ${req_date} at ${req_time}. Here is the Google Meet link: ${googleMeetLink} candidate email:- ${get_student.email}`,
    };
    try {
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(mailOptions2);
      console.log("successs");
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "please try again later" });
    }

    const new_match = new Scheduled_Request({
      date: req_date,
      time: req_time,
      interviewer_name: req_interviewer_name,
      interviewer_email: check.email || "notprovided@gmail.com",
      interviewer_company: get_interviewer.currentlyworking,
      interviewer_role: get_interviewer.currentrole,
      interviewer_experience: get_interviewer.yearsofexperience,
      student_name: req_student_name,
      student_email: get_student.email,
      student_university: get_student.university,
      student_course: get_student.universitycourse,
      student_CGPA: get_student.universitycgpa,
      student_passoutdate: get_student.passoutdate,
      google_meet_link: googleMeetLink,
    });

    await new_match.save();

    const del_active_requests = await Student_Request.findOneAndDelete({
      username: get_student.username,
    });

    return res.status(200).end("The interview is scheduled");
  } catch (e) {
    console.error(e);
    return res.status(400).end("Please try again later");
  }
});

module.exports = router;
