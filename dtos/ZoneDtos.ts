import type mongoose from "mongoose";

export interface IZone {
    ZoneName: string,
    ZoneLeader: mongoose.Types.ObjectId
}