const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("No token");
  }

  try {
    const decoded = jwt.verify(token, "secret");

    // decoded = { id, role }
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

module.exports = auth;