// Connecting to the database
const mongoose = require("mongoose");
const mongoURI ="mongodb+srv://proconnect522:ProConnectEpic@cluster0.tyjguvn.mongodb.net/ProConnect";
const profile_connectDB = async () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB for profiles"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
};
// Defining the schema and model
const Student_profileSchema = new mongoose.Schema({
  username: String,
  email: String,
  university: String,
  universitycourse: String,
  universitycgpa: String,
  passoutdate: String,
  skills: [String], // Array of strings
});

const Professional_profileSchema = new mongoose.Schema({
  username: String,
  email: String,
  skills: [String],
  universityname: String,
  yearsofexperience: Number,
  currentlyworking: String,
  currentrole: String,
  origin: String,
  linkedin: String,
});
const Student_Profile = mongoose.model(
  "student_user_profiles",
  Student_profileSchema
);
const Professional_Profile = mongoose.model(
  "professional_user_profiles",
  Professional_profileSchema
);

module.exports = {
  profile_connectDB,
  Student_Profile,
  Professional_Profile,
};
