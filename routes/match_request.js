const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { auth } = require("./auth");
const nodemailer = require("nodemailer");
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
  
  if (!Array.isArray(get_requirement_skills) || !Array.isArray(get_professional_skills)) {
    console.error("Skills data is not an array.");
    return; // Skip this iteration if skills data is not an array
  }

  let matchedSkillsCount = 0;
  
  for (const skill of get_requirement_skills) {
    // Use .trim() to handle potential whitespace issues
    const trimmedSkill = skill.trim();
    
    if (get_professional_skills.includes(trimmedSkill)) {
      matchedSkillsCount++;
    }
  }
  
  const totalSkillsCount = get_requirement_skills.length; // Total skills in the requirement
  
  // Calculate the percentage match, considering the total skills in the requirement
  const matchPercentage = (matchedSkillsCount / totalSkillsCount) * 100;

  let temp = [matchPercentage, i];
  matched_result.push(temp);
});

    console.log(matched_result);
    return res.json([matched_result]);
  } catch (e) {
    console.log(e);
    return res.status(500).end("Please try again later" + e);
  }
});

// router.post("/match_to_request", async (req, res) => {
//   function generateUniqueMeetLink() {
//     return `https://meet.google.com`
//   }
//   const check = auth(req);
//   console.log(check);
//   if (check.isLoggedin == false && check.role == "student") {
//     return res
//       .status(400)
//       .end("Your logged out or not allowed to access this page");
//   }
//   try {
//     const req_interviewer_name = check.username;
//     const req_student_name = req.body.studentname;
//     const req_date = req.body.date;
//     const req_time = req.body.time;

//     const verify_schedule = await Scheduled_Request.findOne({
//       interviewer_name: req_interviewer_name,
//       date: req_date,
//       time: req_time,
//     });

//     if (verify_schedule) {
//       return res
//         .status(400)
//         .end("You have a scheduled interview at the same time selected");
//     }

//     const get_interviewer = await Professional_Profile.findOne({
//       username: check.username,
//     });
//     const get_student = await Student_Profile.findOne({
//       username: req_student_name,
//     });

//     const googleMeetLink = generateUniqueMeetLink();

//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: "proconnect522@gmail.com",
//         pass: "dkdb mhxd vgxt dabg",
//       },
//     });

//     const mailOptions = {
//       from: "proconnect522@gmail.com",
//       to: [ get_student.email],
//       subject: "Interview Meeting Link",
//       text: `You have an interview scheduled on ${req_date} at ${req_time}. Here is the Google Meet link: ${googleMeetLink} interviewer email:- ${get_interviewer.email}`,
//     };
//     const mailOptions2 = {
//       from: "proconnect522@gmail.com",
//       to: [get_interviewer.email],
//       subject: "Interview Meeting Link",
//       text: `You have an interview scheduled on ${req_date} at ${req_time}. Here is the Google Meet link: ${googleMeetLink} candidate email:- ${get_student.email}`,
//     };
//     try {
//       await transporter.sendMail(mailOptions);
//       await transporter.sendMail(mailOptions2);
//       console.log("successs");
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json({ message: "please try again later" });
//     }

//     const new_match = new Scheduled_Request({
//       date: req_date,
//       time: req_time,
//       interviewer_name: req_interviewer_name,
//       interviewer_email: check.email || "notprovided@gmail.com",
//       interviewer_company: get_interviewer.currentlyworking,
//       interviewer_role: get_interviewer.currentrole,
//       interviewer_experience: get_interviewer.yearsofexperience,
//       student_name: req_student_name,
//       student_email: get_student.email,
//       student_university: get_student.university,
//       student_course: get_student.universitycourse,
//       student_CGPA: get_student.universitycgpa,
//       student_passoutdate: get_student.passoutdate,
//       google_meet_link: googleMeetLink,
//     });

//     await new_match.save();

//     const del_active_requests = await Student_Request.findOneAndDelete({
//       username: get_student.username,
//     });

//     return res.status(200).end("The interview is scheduled");
//   } catch (e) {
//     console.error(e);
//     return res.status(400).end("Please try again later");
//   }


router.post("/match_to_request", async (req, res) => {
  function generateUniqueMeetLink() {
    const getRandomAlphabets = (length) => {
      const alphabets = 'abcdefghijklmnopqrstuvwxyz';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
      }
      return result;
    };

    return `https://meet.google.com/${getRandomAlphabets(3)}-${getRandomAlphabets(4)}-${getRandomAlphabets(3)}`;
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

    // const mailOptions = {
    //   from: "proconnect522@gmail.com",
    //   to: [ get_student.email],
    //   subject: "Interview Meeting Link",
    //   text: `You have an interview scheduled on ${req_date} at ${req_time}. Here is the Google Meet link: ${googleMeetLink} interviewer email:- ${get_interviewer.email}`,
    // };
    // const mailOptions2 = {
    //   from: "proconnect522@gmail.com",
    //   to: [get_interviewer.email],
    //   subject: "Interview Meeting Link",
    //   text: `You have an interview scheduled on ${req_date} at ${req_time}. Here is the Google Meet link: ${googleMeetLink} candidate email:- ${get_student.email}`,
    // };
    const mailOptions = {
  from: "proconnect522@gmail.com",
  to: [get_student.email],
  subject: "Interview Meeting Link",
  html: `
    <p>Dear ${get_student.name},</p>
    <p>You have an interview scheduled on ${req_date} at ${req_time}. Here is the Google Meet link:</p>
    <a href="${googleMeetLink}" target="_blank">${googleMeetLink}</a>
    <p>Interviewer Email: ${get_interviewer.email}</p>
    <p>Please click the link above to join the meeting.</p>
    <p>Best Regards,</p>
    <p>Team ProConnect - your interview scheduler</p>
    <br/>
    <p style="font-size: 80%; color: #888;">This is an automated email. Please do not reply.</p>
  `,
};

const mailOptions2 = {
  from: "proconnect522@gmail.com",
  to: [get_interviewer.email],
  subject: "Interview Meeting Link",
  html: `
    <p>Dear ${get_interviewer.name},</p>
    <p>You have an interview scheduled on ${req_date} at ${req_time}. Here is the Google Meet link:</p>
    <a href="${googleMeetLink}" target="_blank">${googleMeetLink}</a>
    <p>Candidate Email: ${get_student.email}</p>
    <p>Please click the link above to join the meeting.</p>
    <p>Best Regards,</p>
    <p>Team ProConnect - your interview scheduler</p>
    <br/>
    <p style="font-size: 80%; color: #888;">This is an automated email. Please do not reply.</p>
  `,
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
