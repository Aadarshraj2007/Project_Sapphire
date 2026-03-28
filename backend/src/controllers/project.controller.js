import * as projectService from "../services/project.service.js";
import { Messages } from "../constants/messages.js";

/**
 * Create project (Gov only)
 */
export const createProject = async (req, res) => {
  try {
    const governmentId = req.user.id;
    const project = await projectService.createProject(req.body, governmentId);
    res.status(201).json({ message: Messages.PROJECT.CREATED, project });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get projects for current user (Gov or Contractor)
 */
export const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjectsForUser(req.user.id, req.user.role);
    res.json(projects);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get single project by ID
 */
export const getProject = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * Get all contractors (Gov only)
 */
export const getAllContractors = async (req, res) => {
  try {
    const contractors = await projectService.getAllContractors();
    res.json(contractors);
  } catch (err) {
    res.status(500).json({ message: Messages.GENERAL.SERVER_ERROR });
  }
};

/**
 * Assign contractor to existing project (Gov only)
 */
export const assignContractor = async (req, res) => {
  try {
    const { projectId, contractorCppId } = req.body;
    const updatedProject = await projectService.assignContractor(projectId, contractorCppId);
    res.json({ message: "Contractor assigned successfully", project: updatedProject });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Update project status (Gov only)
 */
export const updateProjectStatus = async (req, res) => {
  try {
    const { projectId, status } = req.body;
    const updatedProject = await projectService.updateProjectStatus(projectId, status);
    res.json({ message: "Project status updated", project: updatedProject });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};