const express = require("express");
const router = express.Router();
const axios = require("axios");

// Handle form submissions
router.post("/sendReport", async (req, res) => {
  let { email, subject, body, isAnonymous } = req.body;

  if (isAnonymous) {
    // If the message is anonymous, you can choose to handle it differently,
    // such as logging it without sending an email or taking other actions.
    // For now, let's assume we do nothing.
    email = "";
  }

  try {
    // Send data to Formspree
    const response = await axios.post("https://formspree.io/f/mbjbknlz", {
      email,
      subject,
      body,
    });
    // console.log(response.json());
    if (response.status === 200) {
      console.log("success");
      res.status(200).json({ message: "Report sent successfully!" });
    } else {
      res.status(500).json({ message: "Failed to send the report." });
    }
  } catch (error) {
    console.error("Error sending report:", error);
    res.status(500).json({ message: "Failed to send the report." });
  }
});

module.exports = router;
