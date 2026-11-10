
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  jti: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
  revokedAt: {
    type: Date,
    default: null,
  },
});

export const Token = mongoose.model("Token", tokenSchema);
