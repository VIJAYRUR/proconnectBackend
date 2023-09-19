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
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Check username and password
    if (!username || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Please enter a valid username or password" });
    }

    // Verify confirm password
    if (confirmpassword !== password) {
      return res
        .status(400)
        .json({ message: "Password and confirm password must match" });
    }

    // Verify role
    if (!role) {
      return res.status(400).json({ message: "Please select a role" });
    }

    // Check email and phone number
    if (
      !email ||
      !email.includes("@") ||
      !email.includes(".") ||
      phone.length < 10
    ) {
      return res
        .status(400)
        .json({ message: "Please enter valid contact information" });
    }

    const newUser = new Candidate({
      username,
      email,
      password,
      phone,
      role,
    });
    await newUser.save();
    console.log(newUser);
    return res.status(200).json({ message: "Added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while creating an account, please try again",
    });
  }
});

module.exports = router;
