export interface IUser {
    FirstName: String,
    MiddleName: String,
    LastName: String,
    Zone: String,
    MaritalStatus: String,
    Sex: String,
    Address: String,
    Age: Number,
    PhoneNumber: String,
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