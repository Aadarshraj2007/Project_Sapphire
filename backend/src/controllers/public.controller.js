import { publicService } from "../services/public.service.js";

export const publicController = {

  getProjectDetails: async (req, res) => {
    try {

      const { projectId } = req.params;

      const data = await publicService.getProjectPublicData(projectId);

      return res.json({
        success: true,
        data,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};