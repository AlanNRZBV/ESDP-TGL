export interface UserFields {
    email: string;
    marketId: number;
    firstName: string;
    lastName: string;
    middleName: string,
    pup: string,
    role: string;
    token: string;
    password: string;
    phoneNumber: string;
    region: string;
    settlement: string,
    address: string,
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserFields, unknown, UserMethods>;