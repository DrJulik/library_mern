import cron from "node-cron";

export const notifyUsers = async () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: { $lte: oneDayAgo },
        returnDate: null,
        notified: false,
      });

      for (const b of borrowers) {
        sendMail({
          email: b.user.email,
          subject: "Book Return Reminder",
          message: `Dear ${b.user.name},

          This is a reminder that you have a book due to be returned today. Please return it as soon as possible!.

          Best regards,
          The Library Team`,
        });

        b.notified = true;
        await b.save();
      }
    } catch (error) {
      console.error("Error notifying users:", error);
    }
  });
};
