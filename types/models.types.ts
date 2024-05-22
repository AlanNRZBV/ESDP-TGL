import mongoose, { Model } from 'mongoose';

export interface EmployeeFields {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  token: string;
  password: string;
  phoneNumber: string;
  region: string;
}

interface EmployeeMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type EmployeeModel = Model<EmployeeFields, unknown, EmployeeMethods>;
