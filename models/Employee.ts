import { model, Schema, Types } from 'mongoose';
import Region from './Region';
import { EmployeeFields, EmployeeModel } from '../types/models.types';

const EmployeeSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: String,
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Region',
    required: true,
    validator: {
      validate: async (value: Types.ObjectId) => {
        const region = await Region.findById(value);
        return Boolean(region);
      },
      message: 'Такого региона не существует',
    },
  },
});

const Employee = model<EmployeeFields, EmployeeModel>('Employee', EmployeeSchema);
export default Employee;
