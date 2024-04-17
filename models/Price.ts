import { model, Schema } from 'mongoose';

const PriceSchema = new Schema({
  price: {
    type: Number,
    required: true,
  },
  exchange: {
    type: Number,
    required: true,
  },
});

const Price = model('Price', PriceSchema);
export default Price;
