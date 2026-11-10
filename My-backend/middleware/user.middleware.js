
import jwt from "jsonwebtoken";
import { Token } from "../model/token.model.js";

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!decoded.sub || !decoded.jti) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const activeToken = await Token.findOne({
      jti: decoded.jti,
      userId: decoded.sub,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!activeToken) {
      return res.status(401).json({
        message: "Token is invalid or revoked",
      });
    }

    req.user = { id: decoded.sub };
    req.auth = { jti: decoded.jti };

    return next();
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name
      )
    ) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    console.error("Authentication error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { authenticateUser };
