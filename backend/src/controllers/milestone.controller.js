import { milestoneService } from "../services/milestone.service.js";
import { createMilestoneSchema, updateMilestoneSchema } from "../validators/milestone.validator.js";
import { Messages } from "../constants/messages.js";

// Create milestone
export const createMilestone = async (req, res, next) => {
  try {
    const data = createMilestoneSchema.parse(req.body);
    const milestone = await milestoneService.createMilestone(data);
    res.status(201).json({ msg: Messages.MILESTONE.CREATED, milestone });
  } catch (err) {
    next(err);
  }
};

// Get milestones of a project
export const getMilestonesByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const milestones = await milestoneService.getMilestonesByProject(projectId);
    res.json({ milestones });
  } catch (err) {
    next(err);
  }
};

// Update milestone
  export const updateMilestone = async (req, res, next) => {
    try {
      const { milestoneId } = req.params;
      const data = updateMilestoneSchema.parse(req.body);
  
      const updated = await milestoneService.updateMilestone(milestoneId, data);
  
      // 🔥 If GOV updates site inspection → trigger finalization
      await milestoneService.checkAndFinalizeMilestone(milestoneId, req.user.id);
  
      res.json({
        msg: Messages.MILESTONE.UPDATED,
        milestone: updated,
      });
    } catch (err) {
      next(err);
    }
  };

// Optional: Get single milestone
export const getMilestoneById = async (req, res, next) => {
  try {
    const { milestoneId } = req.params;
    const milestone = await milestoneService.getMilestoneById(milestoneId);
    res.json({ milestone });
  } catch (err) {
    next(err);
  }
};