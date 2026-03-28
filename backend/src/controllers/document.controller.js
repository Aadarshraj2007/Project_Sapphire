import { documentService } from "../services/document.service.js";
import { Messages } from "../constants/messages.js";
import {
  uploadDocumentSchema,
  submitDocumentSchema,
  verifyDocumentSchema,
} from "../validators/document.validator.js";

export const documentController = {

  // Upload document
  uploadDocument: async (req, res, next) => {
    try {
      const { milestoneId, type, isPublic } = uploadDocumentSchema.parse(req.body);
      const file = req.file;
      const uploadedBy = req.user.id;

      const doc = await documentService.uploadDocument({
        file,
        milestoneId,
        uploadedBy,
        type,
        isPublic,
      });

      res.json({ msg: Messages.DOCUMENT.UPLOADED, document: doc });
    } catch (err) {
      next(err);
    }
  },

  // Submit document
  submitDocument: async (req, res, next) => {
    try {
      const { documentId } = submitDocumentSchema.parse(req.params);

      const doc = await documentService.submitDocument(
        documentId,
        req.user.id
      );

      res.json({ msg: "Document submitted successfully", document: doc });
    } catch (err) {
      next(err);
    }
  },

  // 🔥 Verify document (UPDATED)
  verifyDocument: async (req, res, next) => {
    try {
      const { documentId } = req.params;
      const { verification, rejectionReason } =
        verifyDocumentSchema.parse(req.body);

      const doc = await documentService.verifyDocument({
        documentId,
        verification,
        rejectionReason,
        govUserId: req.user.id, // ✅ important
      });

      res.json({ msg: "Document verification updated", document: doc });
    } catch (err) {
      next(err);
    }
  },


  resubmitDocument: async (req, res, next) => {
    try {
  
      const { documentId } = resubmitDocumentSchema.parse(req.params);
  
      const file = req.file;
  
      const doc = await documentService.resubmitDocument({
        documentId,
        file,
        userId: req.user.id
      });
  
      res.json({
        msg: "Document resubmitted successfully",
        document: doc
      });
  
    } catch (err) {
      next(err);
    }
  },

  // Get documents
  getDocumentsByMilestone: async (req, res, next) => {
    try {
      const { milestoneId } = req.params;

      const docs = await documentService.getDocumentsByMilestone(
        milestoneId
      );

      res.json({ documents: docs });
    } catch (err) {
      next(err);
    }
  },
};