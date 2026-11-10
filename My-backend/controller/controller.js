// import { User } from "../model/user.model.js";
// const registerUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields are important!" });
//     }
//     const existing = await User.findOne({
//       email: email.toLowerCase(),
//     });
//     if (existing) {
//       return res
//         .status(400)
//         .json({ message: "The following email is already registered" });
//     }
//     const user = await User.create({
//       username,
//       email: email.toLowerCase(),
//       password,
//       loggedIn: false,
//     });
//     res.status(201).json({
//       message: "User registered",
//       user: {
//         id: user.id,
//         email: user.email,
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("LOGIN BODY:", req.body);
//     const user = await User.findOne({
//       email: email.toLowerCase(),
//     });
//     if (!user)
//       return res.status(400).json({
//         message: "User not found",
//       });
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch)
//       return res.status(400).json({
//         message: "Invalid credentials",
//       });
//     res.status(200).json({
//       message: "User Logged in",
//       user: {
//         id: user._id,
//         email: user.email,
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       mesage: "Internal Server Error",
//     });
//   }
// };
// const logoutuser = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     console.log("userId: ", userId);
//     const user = await User.findOne({
//       _id: userId,
//     });
//     if (!user)
//       return res.status(404).json({
//         message: "User not found",
//       });
//     res.status(200).json({
//       message: "Logout successful",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal server Error",
//       error,
//     });
//   }
// };

// export { registerUser, loginUser, logoutuser };

import { User } from "../model/user.model.js";
import { Token } from "../model/token.model.js";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { RefreshToken } from "../model/refreshToken.model.js";


const COOKIE_NAME = "accessToken";
const REFRESH_COOKIE_NAME = "refreshToken";
// const ACCESS_TOKEN_EXPIRY = 15 * 60;
const ACCESS_TOKEN_EXPIRY = 0.5 * 60;

// const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_EXPIRY = 2 * 60;


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  
};

const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      !username.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password,
      loggedIn: false,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// LOGIN USER

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate access token
    const accessJti = randomUUID();

    const accessToken = jwt.sign(
      { sub: user._id.toString() },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: ACCESS_TOKEN_EXPIRY,
        jwtid: accessJti,
      }
    );

    // Generate refresh token
    const refreshJti = randomUUID();

    const refreshToken = jwt.sign(
      { sub: user._id.toString() },
      process.env.REFRESH_TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: REFRESH_TOKEN_EXPIRY,
        jwtid: refreshJti,
      }
    );

    // Save access token record
    await Token.create({
      jti: accessJti,
      userId: user._id,
      expiresAt: new Date(
        Date.now() + ACCESS_TOKEN_EXPIRY * 1000
      ),
    });

    // Save refresh token record
    await RefreshToken.create({
      jti: refreshJti,
      userId: user._id,
      expiresAt: new Date(
        Date.now() + REFRESH_TOKEN_EXPIRY * 1000
      ),
    });

    // Set access cookie
    res.cookie(COOKIE_NAME, accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_EXPIRY * 1000,
    });

    // Set refresh cookie
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_EXPIRY * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken =
      req.cookies?.[REFRESH_COOKIE_NAME];

    if (!oldRefreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
      });
    }

    // Verify refresh JWT
    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    // Delete old refresh token record.
    // This also prevents reuse of the old token.
    // const oldToken = await RefreshToken.findOneAndDelete({
    //   jti: decoded.jti,
    //   userId: decoded.sub,
    //   expiresAt: { $gt: new Date() },
    // });

    // if (!oldToken) {
    //   return res.status(401).json({
    //     message: "Refresh token is invalid or already used",
    //   });
    // }
const oldToken = await RefreshToken.findOne({
      jti: decoded.jti,
      userId: decoded.sub,
      expiresAt: { $gt: new Date() },
    });

    if (!oldToken) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    // Preserve original expiry date
    const originalExpiry = oldToken.expiresAt;

    // Remove old refresh token
    await RefreshToken.deleteOne({
      _id: oldToken._id,
    });

    // Generate new access token
    const accessJti = randomUUID();

    const accessToken = jwt.sign(
      { sub: decoded.sub },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: ACCESS_TOKEN_EXPIRY,
        jwtid: accessJti,
      }
    );

    // Generate new refresh token
    const refreshJti = randomUUID();

    const refreshToken = jwt.sign(
      { sub: decoded.sub },
      process.env.REFRESH_TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: Math.floor(
          (originalExpiry.getTime() - Date.now()) / 1000
        ), 
        jwtid: refreshJti,
      }
    );

    // Save new access token
    await Token.create({
      jti: accessJti,
      userId: decoded.sub,
      expiresAt: new Date(
        Date.now() + ACCESS_TOKEN_EXPIRY * 1000
      ),
    });

    // Save new refresh token
    await RefreshToken.create({
      jti: refreshJti,
      userId: decoded.sub,
      expiresAt: originalExpiry,
    });

    // Set new access cookie
    res.cookie(COOKIE_NAME, accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_EXPIRY * 1000,
    });

    // Set new refresh cookie
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...cookieOptions,
      maxAge: originalExpiry.getTime()-Date.now(),
    });

    return res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
    });

  } catch (error) {
    console.error("Refresh token error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};


// LOGOUT USER

const logoutuser = async (req, res) => {
  try {
    const accessToken = req.cookies?.[COOKIE_NAME];
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    // Revoke access token
    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.JWT_SECRET,
          {
            algorithms: ["HS256"],
            ignoreExpiration: true,
          }
        );

        if (decoded.jti) {
          await Token.deleteOne({
            jti: decoded.jti,
          });
        }
      } catch (error) {
        // Invalid access token
      }
    }

    // Revoke refresh token
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          {
            algorithms: ["HS256"],
            ignoreExpiration: true,
          }
        );

        if (decoded.jti) {
          await RefreshToken.deleteOne({
            jti: decoded.jti,
          });
        }
      } catch (error) {
        // Invalid refresh token
      }
    }

    // Clear both cookies
    res.clearCookie(COOKIE_NAME, clearCookieOptions);
    res.clearCookie(
      REFRESH_COOKIE_NAME,
      clearCookieOptions
    );

    return res.status(200).json({
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Logout error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export { registerUser, loginUser, logoutuser,refreshAccessToken ,};
