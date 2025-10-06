import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async (name, userId) => {
  if (!name) throw new Error("Project name is required");
  if (!userId) throw new Error("User ID is required");

  const project = new projectModel({ name, users: [userId] });
  try {
    return await project.save();
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      throw new Error("Project name already exists");
    }
    throw err;
  }
  return project.save();
};

export const getAllProjectsByUserId = async ({ userId }) => {
  if (!userId) throw new Error("User ID is required");
  const allUserProjects = await projectModel.find({ users: userId });
  return allUserProjects;
};

export const addUserToProject = async ({ projectId, users, userId }) => {
  if (!projectId) throw new Error("Project ID is required");
  if (!users || !Array.isArray(users) || users.length === 0) {
    throw new Error("Users array is required and cannot be empty");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }
  for (const userId of users) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid User ID: ${userId}`);
    }
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  const project = await projectModel.findOne({ _id: projectId, users: userId });
  if (!project) throw new Error("Project not found");
  project.users.push(...users);
  const updatedProject = await project.save();
  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) throw new Error("Project ID is required");

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  const project = await projectModel
    .findOne({ _id: projectId })
    .populate("users", "-password");
  if (!project) throw new Error("Project not found");
  return project;
};
