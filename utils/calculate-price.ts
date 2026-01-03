import { Gender, MaritalStates } from "../dtos/CreateUser.js";

export function calculatePrice(MaritalStatus: MaritalStates, sex: Gender): number {
    let price = 200;
    if (MaritalStatus === MaritalStates.MARRIED || MaritalStatus === MaritalStates.WIDOWED) {
        if (sex === Gender.MALE) {
            price = 500;
        } else {
            price = 300;
        }
    }
    if (MaritalStatus === MaritalStates.SINGLE) {
        price = 200;
    }

    return price;
}