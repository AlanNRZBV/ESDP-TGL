import mongoose, { Types } from 'mongoose';
import User from './User';
import PUP from './Pup';
import { ShipmentData } from '../types/shipment.types';

const Schema = mongoose.Schema;

const ShipmentSchema = new Schema<ShipmentData>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: 'User does not exist!',
    },
  },
  userMarketId: {
    type: Number,
    default: 0,
  },
  pupId: {
    type: Schema.Types.ObjectId,
    ref: 'PUP',
    required: function () {
      return !(this.status === 'КНР_ПРИБЫЛО' || this.status === 'КНР_ОТПРАВЛЕНО');
    },
    validate: {
      validator: async function (this: ShipmentData, value: Types.ObjectId) {
        if (this.status !== 'КНР_ПРИБЫЛО' && this.status !== 'КНР_ОТПРАВЛЕНО') {
          const pup = await PUP.findById(value);
          return Boolean(pup);
        }
        return true;
      },
      message: 'Такого ПВЗ нет в списке',
    },
  },
  status: {
    type: String,
    enum: ['КР_ОТПРАВЛЕНО', 'КР_ПРИБЫЛО', 'КНР_ОТПРАВЛЕНО', 'КНР_ПРИБЫЛО', 'ЗАВЕРШЕН', 'ОТКАЗ'],
    default: 'КНР_ПРИБЫЛО',
  },
  dimensions: {
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    length: {
      type: Number,
    },
  },
  weight: {
    type: Number,
    required: true,
  },
  price: {
    usd: {
      type: Number,
      required: true,
    },
    som: {
      type: Number,
      required: true,
    },
  },
  trackerNumber: {
    type: Number,
    required: true,
  },
  delivery: {
    status: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '',
    },
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  datetime: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  isPriceVisible: {
    type: Boolean,
    default: true,
  },
});

const Shipment = mongoose.model('Shipment', ShipmentSchema);
export default Shipment;
