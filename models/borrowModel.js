import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowedDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  fine: { type: Number, default: 0 },
  notified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "borrowed", "returned", "overdue"],
    default: "pending",
  },
});

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
