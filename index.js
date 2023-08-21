// entry point to the backend
const express = require("express");
const { user_connectDB } = require("./routes/user_db");
const { profile_connectDB } = require("./routes/profiles_db");
profile_connectDB();
user_connectDB();

// routes
const login_routes = require("./routes/logins");
const register_routes = require("./routes/register");
const student_profile_routes = require("./routes/student_profile");
const professional_profile_routes = require("./routes/professional_profiles");

const app = express();
const PORT = 3000;

app.use(express.json());
app.listen(PORT, (error) => {
  if (!error) {
    console.log("Proconnect is online, please login");
  } else console.log("Error occurred, server can't start", error);
});

app.get("/login", (req, res) => {
  console.log("here in login your");
  const user = req.body.username;
  const pass = req.body.password;
  res.send("Welcome" + " " + user + " " + pass);
});

//user login
app.use("/user", login_routes);

//user register
app.use("/user", register_routes);

// student profile
app.use("/user", student_profile_routes);

// professional profile
app.use("/user", professional_profile_routes);
