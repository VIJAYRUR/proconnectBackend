// entry point to the backend
const express = require("express");
const app = express();

const cors = require("cors");
const PORT = 5000;

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://proconnect-frontend-be92.vercel.app');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Add 'Authorization'
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add any other HTTP methods you need

//   next();
// });

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'https://proconnect-frontend-4w6ppdy5j-vijayrur.vercel.app','https://proconnect-frontend-i41l-fuqasil3p-vijayrur.vercel.app','https://proconnect-frontend.vercel.app','https://proconnect-frontend-13ovwl20y-vijayrur.vercel.app'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Add 'Authorization'
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add any other HTTP methods you need

  next();
});

app.use(express.json());


// collections
const { user_connectDB } = require("./routes/DB/user_db");
const { profile_connectDB } = require("./routes/DB/profiles_db");
const { request_connectDB } = require("./routes/DB/request_db");
const { feedback_connectDB } = require("./routes/DB/feedback_db");
const { Scheduled_connectDB } = require("./routes/DB/scheduled_request_db");
// profile_connectDB();
user_connectDB();
// request_connectDB();
// feedback_connectDB();
// Scheduled_connectDB();

// routes
const login_routes = require("./routes/logins");
const register_routes = require("./routes/register");
const student_profile_routes = require("./routes/student_profile");
const professional_profile_routes = require("./routes/professional_profiles");
const make_request_routes = require("./routes/interview_request");
const match_request_routes = require("./routes/match_request");
const view_scheduled_interview_routes = require("./routes/view_scheduled_interviews");
const feedback_routes = require("./routes/feedback");
const logout_routes = require("./routes/logout");
const report_routes = require("./routes/report");

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

// interview request
app.use("/user", make_request_routes);

// request matching
app.use("/user", match_request_routes);

// view scheduled interviews
app.use("/user", view_scheduled_interview_routes);

// feedback routes
app.use("/user", feedback_routes);

// logout
app.use("/user", logout_routes);

// report
app.use("/api", report_routes);
