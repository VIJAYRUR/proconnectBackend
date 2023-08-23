const express = require("express");
const router = express.Router();
const { Candidate } = require("./DB/user_db");

// Register route
router.post("/register", async (req, res) => {
  console.log("Hello from register");

  const { username, email, phone, password, confirmpassword, role } = req.body;

  try {
    // Check if the username or email exists
    const existingUser = await Candidate.findOne({ username });
    const existingEmail = await Candidate.findOne({ email });

    if (existingUser || existingEmail) {
      return res.status(400).end("Username or email already exists");
    }

    // Check username and password
    if (!username || password.length < 6) {
      return res.status(400).end("Please enter a valid username or password");
    }

    // Verify confirm password
    if (confirmpassword !== password) {
      return res.status(400).end("Password and confirm password must match");
    }

    // Verify role
    if (!role) {
      return res.status(400).end("Please select a role");
    }

    // Check email and phone number
    if (
      !email ||
      !email.includes("@") ||
      !email.includes(".") ||
      phone.length < 10
    ) {
      return res.status(400).end("Please enter valid contact information");
    }

    const newUser = new Candidate({
      username,
      email,
      password,
      phone,
      role,
    });
    await newUser.save();
    return res.status(200).end("Added successfully");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .end("An error occurred while creating an account, please try again");
  }
});

module.exports = router;
