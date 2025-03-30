import jwt from "jsonwebtoken";
import createError from "../utils/error.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  //   console.log("Token:", token); // Should not be undefined
  //   console.log("Cookies:", req.cookies); // Should not be undefined
  //   console.log("Headers Cookie:", req.headers.cookie); // Should contain accessToken

  if (!token) {
    return next(createError(401, "You are not authenticated"));
  }
  jwt.verify(token, process.env.JWTSECRET, async (err, payload) => {
    if (err) {
      return next(createError(403, "Token is not valid"));
    }
    req.userId = payload.id;
    req.isAdmin = payload.isAdmin;
    next();
  });
};
