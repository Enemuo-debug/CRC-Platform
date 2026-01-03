import type mongoose from "mongoose";

export interface IZone {
    ZoneName: String,
    ZoneLeader: mongoose.Types.ObjectId
}