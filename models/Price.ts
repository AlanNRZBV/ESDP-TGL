import { model, Schema } from 'mongoose';

const PriceSchema = new Schema({
  exchangeRate: {
    type: Number,
    required: true,
  },
  deliveryPrice: {
    type: Number,
    required: true,
  },
});

const Price = model('Price', PriceSchema);
export default Price;
