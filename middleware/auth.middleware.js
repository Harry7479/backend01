import jwt from "jsonwebtoken";

export const isLoggedIn = (req, res, next) => {
  try {
    let token;

    //  Try cookie first
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    //  Fallback to Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
