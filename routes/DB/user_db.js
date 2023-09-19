// Connecting to the database
const mongoose = require("mongoose");
const mongoURI ="mongodb+srv://proconnect522:ProConnectEpic@cluster0.tyjguvn.mongodb.net/ProConnect";

const user_connectDB = async () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB for logins"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
};
// Defining the schema and model
const candidateSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone: String,
  role: String,
});
const Candidate = mongoose.model("user_details", candidateSchema);

module.exports = {
  user_connectDB,
  Candidate,
};
