import { publicService } from "../services/public.service.js";
import prisma from "../config/prisma.js";
import path from "path";
import { createComplaintSchema } from "../validators/public.validator.js";

export const publicController = {

  submitComplaint: async (req, res, next) => {
    try {
      const data = createComplaintSchema.parse(req.body);
      const complaint = await publicService.submitComplaint(data);
      res.json({
        success: true,
        message: "Complaint submitted successfully",
        complaint,
      });
    } catch (err) {
      next(err);
    }
  },

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

  getAllProjects: async (req, res) => {
    try {
      const projects = await publicService.getAllProjects();
      return res.json({
        success: true,
        data: projects,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  viewPublicDocument: async (req, res, next) => {
    try {
      const { documentId } = req.params;
      const document = await prisma.document.findUnique({
        where: { id: documentId },
      });

      if (!document) {
        return res.status(404).json({ success: false, message: "Document not found" });
      }

      // Ensure the path is absolute for res.sendFile
      const absolutePath = path.resolve(document.fileUrl);
      
      res.contentType("application/pdf");
      res.sendFile(absolutePath);
    } catch (err) {
      next(err);
    }
  },
};