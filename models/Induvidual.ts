import { model, Schema } from "mongoose";
import type { IUser } from "../dtos/CreateUser.js";
import { Gender, MaritalStates } from "../dtos/CreateUser.js";

const MemberSchema = new Schema<IUser>(
  {
    FirstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    MiddleName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    LastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    PhoneNumber: {
      type: String,
      unique: true,
      required: true
    },

    Zone: {
      type: Schema.Types.ObjectId,
      ref: "Zones",
      required: true,
      trim: true,
    },

    MaritalStatus: {
      type: String,
      required: true,
      enum: Object.values(MaritalStates),
    },

    Sex: {
      type: String,
      required: true,
      enum: Object.values(Gender),
    },

    Address: {
      type: String,
      required: true,
    },

    Age: {
      type: Number,
      min: 0,
      max: 200,
    },

    Expired: {
      type: Boolean,
      default: true,
    },

    isNewMember: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const Member = model<IUser>("Member", MemberSchema);

export default Member;
