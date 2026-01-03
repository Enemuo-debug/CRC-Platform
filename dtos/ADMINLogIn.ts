import type mongoose from "mongoose";

export interface LoginDto {
    EmailAddress: string,
    Password: string
}

export interface IMemberCreate {
    FirstName: string,
    MiddleName: string,
    LastName: string,
    Zone: mongoose.Types.ObjectId,
    MaritalStatus: string,
    Sex: string,
    Address: string,
    Age: Number,
    PhoneNumber: string,
}