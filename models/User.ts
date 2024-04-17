import mongoose, {HydratedDocument} from "mongoose";
import {UserFields, UserModel} from "../types";
import bcrypt from 'bcrypt';
import {randomUUID} from "crypto";
import { PhoneNumberUtil } from 'google-libphonenumber';

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
        required: true,
    },
    marketId: {
        type: Number,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(phoneNumber: string) {
                try {
                    const parsedPhoneNumber = phoneUtil.parse(phoneNumber, 'KG');
                    return phoneUtil.isValidNumber(parsedPhoneNumber);
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
    role: {
        type: String,
        required: true,
        enum: ['client', 'admin', 'manager'],
        default: 'client',
    },
    region: {
        type: String,
        required: true,
        enum: ['Batken',
            'Jalal-Abad',
            'Issyk-Kul',
            'Naryn',
            'Osh',
            'Talas',
            'Chuy'],
    },
});

UserSchema.methods.checkPassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = randomUUID();
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