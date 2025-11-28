import cron from 'node-cron';
import User from '../models/userModel';

export const removeUnverifiedAccounts = (): void => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const result = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lte: thirtyMinutesAgo },
      });
      
      if (result.deletedCount && result.deletedCount > 0) {
        console.log(`Removed ${result.deletedCount} unverified accounts`);
      }
    } catch (error) {
      console.error('Error removing unverified accounts:', error);
    }
  });
};

