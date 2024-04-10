export interface UserFields {
    email: string;
    marketId: number;
    firstName: string;
    lastName: string;
    middleName: string,
    role: string;
    token: string;
    password: string;
    phoneNumber: number;
    region: string;
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserFields, unknown, UserMethods>;