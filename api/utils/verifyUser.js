import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import { generateAccessToken } from "./token.js";

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.access_token;

//   if (!token) return next(errorHandler(401, 'Unauthorized'));

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(errorHandler(403, 'Forbidden'));

//     req.user = user;
//     next();
//   });
// };

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized aditya prachi"));

  jwt.verify(token, "adityaaditya", (err, user) => {
    if (err) {
      // If access token expired
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) return next(errorHandler(401, "Unauthorized"));

      jwt.verify(refreshToken, "adityaaditya", (refreshErr, userData) => {
        if (refreshErr)
          return next(errorHandler(403, "Forbidden refech token expired"));

        const newAccessToken = generateAccessToken(userData.id);
        res.cookie("access_token", newAccessToken, { httpOnly: true });
        req.user = userData;
        next();
      });
    } else {
      req.user = user;
      next();
    }
  });
};

export const refreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) return next(errorHandler(401, "Unauthorized aditya"));

  jwt.verify(refreshToken, "adityaaditya", (err, userData) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    const newAccessToken = generateAccessToken(userData.id);
    res.cookie("access_token", newAccessToken, { httpOnly: true });
    res.status(200).json("Access token refreshed successfully!");
  });
};
