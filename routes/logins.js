// porting login route
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Candidate } = require("./user_db");

router.get("/login", async (req, res) => {
  const req_user = req.body.username;
  const req_pass = req.body.password;
  const req_role = req.body.role;
  const get_user = await Candidate.findOne({ username: req_user });
  // user not found
  if (!get_user) {
    return res.status(400).end("User not found");
  }
  // password doesnt match
  if (get_user.password != req_pass) {
    return res.status(400).end("password is incorrect");
  }
  try {
    //Creating jwt token
    token = jwt.sign(
      { username: get_user.username, email: get_user.email },
      "secretkeyappearshere",
      { expiresIn: "5h" }
    );

    return res.status(200).json({ my_token: token });
  } catch (err) {
    console.log(err);
    res.status(400).end("Error occurred while creating session");
  }
  return res.status(200).end("Welcome " + req_role);
});

module.exports = router;
