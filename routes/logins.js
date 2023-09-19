// porting login route
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Candidate } = require("./DB/user_db");

router.post("/login", async (req, res) => {
  const req_user = req.body.username;
  const req_pass = req.body.password;
  const req_role = req.body.role;
  console.log(req_user);
  const get_user = await Candidate.findOne({ username: req_user });
  const all_details= await Candidate.find(); 
  console.log(all_details)
  // user not found
  if (!get_user) {
    return res.status(400).json({message:"User not found"});
  }
  // password doesnt match
  if (get_user.password != req_pass) {
    return res.status(400).json({message:"password is incorrect"});
  }
  if (get_user.role != req_role) {
    return res.status(400).json({
      message: "please login with alloted role or make a new account",
    });
  }
  try {
    //Creating jwt token
    token = jwt.sign(
      {
        username: get_user.username,
        email: get_user.email,
        role: get_user.role,
      },
      "secretkeyappearshere",
      { expiresIn: "5h" }
    );

    return res
      .status(200)
      .json({
        my_token: token,
        role: get_user.role,
        message: "Welcome " + req_role,
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occurred while creating session" });
  }
});

module.exports = router;
