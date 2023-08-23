// Connecting to the database
const mongoose = require("mongoose");
const mongoURI = "mongodb://0.0.0.0:27017/ProConnect";

const Scheduled_connectDB = async () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB for scheduled requests"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
};
const Scheduled_requestSchema = new mongoose.Schema({
  date: String,
  time: String,
  interviewer_name: String,
  interviewer_email: String,
  interviewer_company: String,
  interviewer_role: String,
  interviewer_experience: Number,
  student_name: String,
  student_email: String,
  student_university: String,
  student_course: String,
  student_CGPA: String,
  student_passoutdate: String,
});
const Scheduled_Request = mongoose.model(
  "scheduled_request",
  Scheduled_requestSchema
);

module.exports = {
  Scheduled_connectDB,
  Scheduled_Request,
};
