import { model, Schema } from "mongoose";
import type { IZone } from "../dtos/ZoneDtos.js";
import Memeber from "./Induvidual.js";

const ZoneSchema = new Schema<IZone>(
  {
    ZoneName: {
      type: String,
      trim: true,
      unique: true,
      required: true
    }
  }
);

const Zone = model<IZone>("Zones", ZoneSchema);

export default Zone;