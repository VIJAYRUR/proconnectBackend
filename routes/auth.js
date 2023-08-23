const jwt = require("jsonwebtoken");

const auth = (req) => {
  const token = req.headers.authorization.split(" ")[1];

  //Authorization
  if (!token) {
    return { isLoggedin: false };
  }
  try {
    const decoded = jwt.verify(token, "secretkeyappearshere");
    // console.log(decoded.role);
    return {
      isLoggedin: true,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (e) {
    return { isLoggedin: false };
  }
};

module.exports = { auth };
