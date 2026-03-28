import prisma  from "../config/prisma.js";
import { Messages } from "../constants/messages.js";
import { UserRole } from "../constants/roles.js";

/**
 * Create a new project (Government only)
 */
export const createProject = async (projectData, governmentId) => {
  // Validate contractor
  const contractor = await prisma.user.findUnique({
    where: { cppUserId: projectData.contractorCppId },
  });

  if (!contractor || contractor.role !== UserRole.CONTRACTOR) {
    throw new Error("Contractor not found or not approved");
  }

  // Create project
  const project = await prisma.project.create({
    data: {
      name: projectData.name,
      description: projectData.description,
      locationState: projectData.locationState,
      locationCity: projectData.locationCity,
      budget: projectData.budget,
      governmentId,
      contractorCppId: projectData.contractorCppId,
    },
  });

  return project;
};

/**
 * Fetch all projects for a user (Gov or Contractor)
 */
export const getProjectsForUser = async (userId, role) => {
  if (role === UserRole.GOVERNMENT) {
    return prisma.project.findMany({
      where: { governmentId: userId },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === UserRole.CONTRACTOR) {
    const contractor = await prisma.user.findUnique({ where: { id: userId } });
    if (!contractor) return [];
    return prisma.project.findMany({
      where: { contractorCppId: contractor.cppUserId },
      orderBy: { createdAt: "desc" },
    });
  }
  return [];
};

/**
 * Fetch a single project by ID
 */
export const getProjectById = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      milestones: true,
      complaints: true,
    },
  });

  if (!project) throw new Error(Messages.PROJECT.NOT_FOUND);
  return project;
};

/**
 * Get all approved contractors (Gov only)
 */
export const getAllContractors = async () => {
  return prisma.user.findMany({
    where: { role: UserRole.CONTRACTOR, approved: true },
    select: { id: true, name: true, email: true, phone: true, cppUserId: true },
  });
};

/**
 * Assign contractor to an existing project (Gov only)
 */
export const assignContractor = async (projectId, contractorCppId) => {
  const contractor = await prisma.user.findUnique({ where: { cppUserId: contractorCppId } });
  if (!contractor || contractor.role !== UserRole.CONTRACTOR) {
    throw new Error("Contractor not found or not approved");
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { contractorCppId },
  });

  return updatedProject;
};

/**
 * Update project status (Gov only)
 */
export const updateProjectStatus = async (projectId, status) => {
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { status },
  });

  return updatedProject;
};