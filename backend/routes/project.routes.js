import Router from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authUser,
  body("name").isString().notEmpty().withMessage("Project name is required"),
  projectController.createProject
);

router.get("/all", authUser, projectController.getAllProjects);

router.put(
    "/add-user",
    authUser,
    body("projectId")
        .isString()
        .notEmpty()
        .withMessage("Project ID must be a non-empty string"),
    body("users")
        .isArray({ min: 1 })
        .withMessage("Users must be a non-empty array")
        .custom((arr) => arr.every((u) => typeof u === "string" && u.trim() !== ""))
        .withMessage("Each user must be a non-empty string"),
    projectController.addUserToProject
);


router.get("/get-project/:projectId" , authUser, projectController.getProjectById);
export default router;
