import express, { urlencoded } from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import connect from "./db/db.js";
import cookieParser from "cookie-parser";

const app = express();
connect();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRoutes);
app.get("/", (req, res) => {
  res.send("hello world");
});

export default app;
