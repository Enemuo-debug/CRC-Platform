import type mongoose from "mongoose";

export interface IUser {
    FirstName: string,
    MiddleName: string,
    LastName: string,
    Zone: mongoose.Types.ObjectId,
    MaritalStatus: string,
    Sex: string,
    Address: string,
    Age: Number,
    PhoneNumber: string,
    CreatedAt: Date,
    Expired: Boolean
}

export enum MaritalStates {
    SINGLE,
    MARRIED,
    WIDOWED,
}

export enum Gender {
    MALE, 
    FEMALE
}