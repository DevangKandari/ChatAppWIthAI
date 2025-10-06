import express, { urlencoded } from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import connect from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import projectRoutes from "./routes/project.routes.js";

const app = express();
connect();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);

export default app;
