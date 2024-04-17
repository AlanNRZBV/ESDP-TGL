import {Schema, model, Types} from "mongoose";
import User from './User';

const ShipmentHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => await User.findById(value),
      message: 'User does not exist!',
    },
  },
  shipments: [{
      type: Schema.Types.ObjectId,
      ref: 'Shipment',
  }],
});

const ShipmentHistory = model('ShipmentHistory', ShipmentHistorySchema);
export default ShipmentHistory;