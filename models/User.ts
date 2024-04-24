import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { UserFields, UserModel } from '../types/user.type';
import PUP from './Pup';
import Region from './Region';

const SALT_WORK_fACTOR = 10;
const phoneUtil = PhoneNumberUtil.getInstance();

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (
        this: HydratedDocument<UserFields>,
        email: string,
      ): Promise<boolean> {
        if (!this.isModified('email')) return true;

        const user: HydratedDocument<UserFields> | null = await User.findOne({
          email,
        });

        return !user;
      },
      message: 'This user is already registered!',
    },
  },
  password: {
    type: String,
    required: true,
  },
  pupID: {
    type: Schema.Types.ObjectId,
    ref: 'PUP',
    required: true,
    validate: async (value: Types.ObjectId) => {
      const pup = await PUP.findById(value);
      return Boolean(pup);
    },
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  marketId: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (phoneNumber: string) {
        try {
          const parsedPhoneNumberKG = phoneUtil.parse(phoneNumber, 'KG');
          const parsedPhoneNumberRU = phoneUtil.parse(phoneNumber, 'RU');
          const parsedPhoneNumberKZ = phoneUtil.parse(phoneNumber, 'KZ');

          const countryCodeKG = parsedPhoneNumberKG.getCountryCode();
          const countryCodeRU = parsedPhoneNumberRU.getCountryCode();
          const countryCodeKZ = parsedPhoneNumberKZ.getCountryCode();

          const nationalNumberKG = parsedPhoneNumberKG.getNationalNumber();
          const nationalNumberRU = parsedPhoneNumberRU.getNationalNumber();
          const nationalNumberKZ = parsedPhoneNumberKZ.getNationalNumber();

          return (
            (countryCodeKG === 996 && nationalNumberKG?.toString().length === 9) ||
            (countryCodeRU === 7 && nationalNumberRU?.toString().length === 11) ||
            (countryCodeKZ === 7 && nationalNumberKZ?.toString().length === 10)
          );
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid phone number format',
    },
  },
  token: {
    type: String,
    required: true,
  },
  settlement: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['client', 'admin', 'manager', 'super'],
    default: 'client',
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
      message: 'VALIDATOR ERROR: Region does not exist!',
    },
  },
});

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

UserSchema.methods.generateMarketID = function () {
  this.marketId = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_fACTOR);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.set('toJSON', {
  transform: (_doc, ret, _options) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model<UserFields, UserModel>('User', UserSchema);

export default User;
