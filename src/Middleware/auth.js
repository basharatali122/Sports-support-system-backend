const jwt = require("jsonwebtoken");
const responseHandler = require("../../responseHandler");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responseHandler(res, { error: "Unauthorized User" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET, (error, data) => {
      if (error) {
        return responseHandler(res, { error: "Forbidden Access" });
      }
      req.user = { ...data }; // Attach user info to request
      next();
    });
  } catch (error) {
    return responseHandler(res, { error: error.message });
  }
};

const role = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return responseHandler(res, { error: "Access denied" });
    }
    next();
  };
};

module.exports = { auth, role };
