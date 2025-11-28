import cron from 'node-cron';
import Borrow from '../models/borrowModel';
import sendEmail from '../utils/sendEmail';
import { IUser, IBorrow } from '../types';

export const notifyUsers = (): void => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: { $lte: oneDayAgo },
        returnDate: null,
        notified: false,
      }).populate<{ user: IUser }>('user');

      for (const borrow of borrowers) {
        if (borrow.user && typeof borrow.user !== 'string') {
          await sendEmail({
            email: borrow.user.email,
            subject: 'Book Return Reminder',
            message: `Dear ${borrow.user.name},

            This is a reminder that you have an overdue book. Please return it as soon as possible to avoid additional fines.

            Best regards,
            The Library Team`,
          });

          borrow.notified = true;
          await borrow.save();
        }
      }
      
      console.log(`Notified ${borrowers.length} users about overdue books`);
    } catch (error) {
      console.error('Error notifying users:', error);
    }
  });
};

