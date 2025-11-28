import cron from "node-cron";
import User from "../models/userModel.js";

export const removeUnverifiedAccounts = async () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      await User.deleteMany({
        accountVerified: false,
        createdAt: { $lte: thirtyMinutesAgo },
      });
    } catch (error) {
      console.error("Error removing unverified accounts:", error);
    }
  });
};
