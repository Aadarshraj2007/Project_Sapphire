import { paymentService } from "../services/payment.service.js";
import { processPaymentSchema } from "../validators/payment.validator.js";

export const paymentController = {

  processPayment: async (req, res, next) => {
    try {

      // ✅ Validate params
      const { milestoneId } = processPaymentSchema.parse(req.params);

      const transaction = await paymentService.processPayment(
        milestoneId,
        req.user.id
      );

      res.json({
        msg: "Payment successful",
        transaction
      });

    } catch (err) {
      next(err);
    }
  }

};