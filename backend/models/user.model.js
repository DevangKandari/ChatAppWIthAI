import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, "email must be at least 5 characters long"],
    maxlength: [50, "email cannot exceed 50 characters"],
  },
  password: {
    type: String,
    select: false,
  },
});

userSchema.statics.hashPassword = async function (password) {
  const bcrypt = await import("bcrypt");
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

userSchema.methods.isValidPassword = async function (password) {
  const bcrypt = await import("bcrypt");
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
