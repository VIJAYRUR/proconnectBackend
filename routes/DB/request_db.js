// Connecting to the database
const mongoose = require("mongoose");
const mongoURI ="mongodb+srv://proconnect522:ProConnectEpic@cluster0.tyjguvn.mongodb.net/ProConnect";
const request_connectDB = async () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB for requests"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
};
const Student_requestSchema = new mongoose.Schema({
  username: String,
  email: String,
  university: String,
  course: String,
  CGPA: String,
  passoutdate: String,
  skills_to_be_questioned: [String],
  depth_of_knowledge: String,
  company_target: String,
  origin_target: String,
});

const Student_Request = mongoose.model(
  "active_requests",
  Student_requestSchema
);

module.exports = {
  request_connectDB,
  Student_Request,
};
