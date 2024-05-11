import { model, Schema } from 'mongoose';
import { PhoneNumberUtil } from 'google-libphonenumber';
const phoneUtil = PhoneNumberUtil.getInstance();

const WarehouseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (phoneNumber: string) {
        try {
          const parsedPhoneNumberCN = phoneUtil.parse(phoneNumber, 'CN');

          const countryCodeCN = parsedPhoneNumberCN.getCountryCode();

          const nationalNumberCN = parsedPhoneNumberCN.getNationalNumber();

          return countryCodeCN === 86 && nationalNumberCN?.toString().length === 11;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid phone number format',
    },
  },
});

const Warehouse = model('Warehouse', WarehouseSchema);
export default Warehouse;
