import { bankService } from "../services/bank.service.js";
import { createBankAccountSchema } from "../validators/bank.validator.js";
import { updateHolderNameSchema } from "../validators/bank.validator.js";

export const bankController = {

  // Create bank account (Supreme Admin)
  createAccount: async (req, res, next) => {
    try {

      const data = createBankAccountSchema.parse(req.body);

      const account = await bankService.createAccount(data);

      res.json({
        msg: "Bank account created successfully",
        account
      });

    } catch (err) {
      next(err);
    }
  },


  // Update holder name
  updateHolderName: async (req, res, next) => {
    try {
      const data = updateHolderNameSchema.parse(req.body);

      const account = await bankService.updateHolderName(data);

      res.json({
        msg: "Holder name updated successfully",
        account
      });

    } catch (err) {
      next(err);
    }
  },


  // Get my bank account
  getMyAccount: async (req, res, next) => {
    try {

      const account = await bankService.getAccountByUser(req.user.id);

      res.json({
        account
      });

    } catch (err) {
      next(err);
    }
  },


  // Get all accounts (Admin)
  getAllAccounts: async (req, res, next) => {
    try {

      const accounts = await bankService.getAllAccounts();

      res.json({
        accounts
      });

    } catch (err) {
      next(err);
    }
  }

};