import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      member?: {
        _id: mongoose.Types.ObjectId;
        price: number;
      }
    }
  }
}

export {};
