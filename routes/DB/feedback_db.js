// Connecting to the database
const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://proconnect522:ProConnectEpic@cluster0.tyjguvn.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

const feedback_connectDB = async () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB for feedback"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
};
const feedbackSchema = new mongoose.Schema({
  interviewer_name: String,
  student_name: String,
  interviewer_email: String,
  student_email: String,
  message: String,
  date: String,
  time: String,
});
const Feedback = mongoose.model("feedback", feedbackSchema);

module.exports = {
  feedback_connectDB,
  Feedback,
};
