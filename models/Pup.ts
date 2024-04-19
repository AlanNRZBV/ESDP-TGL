import { model, Schema, Types } from 'mongoose';
import Region from './Region';
const PUPSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    region: {
      type: Schema.Types.ObjectId,
      ref: 'Region',
      required: true,
      validate: async (value: Types.ObjectId) => {
        const region = await Region.findById(value);
        return Boolean(region);
      },
      message: 'VALIDATOR ERROR: Region does not exist!',
    },

    settlement: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    isChina: {
      type: Boolean,
      default: false,
    },

    phoneNumber: Number,
  },
  { versionKey: false },
);

const PUP = model('PUP', PUPSchema);
export default PUP;
