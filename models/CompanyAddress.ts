import { model, Schema } from 'mongoose';

const CompanyAddressSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  postCode: {
    type: String,
    required: true,
  },
});

const CompanyAddress = model('CompanyAddress', CompanyAddressSchema);
export default CompanyAddress;
