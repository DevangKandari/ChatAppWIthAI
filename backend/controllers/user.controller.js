import user from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await userService.createUser(req.body);
    const token = user.generateJWT();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const foundUser = await user.findOne({ email }).select("+password");
    if (!foundUser) {
      return res.status(401).send("Invalid email or password");
    }
    const isPasswordValid = await foundUser.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ errors: "Invalid email or password" });
    }
    const token = foundUser.generateJWT();
    res.status(200).send({ user: foundUser, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const profileController = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    redisClient.set(token, "logout", "EX", 3600 * 24);
    res.status(200).json({ message: "Successfully logged out" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};
