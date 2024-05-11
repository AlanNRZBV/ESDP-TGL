import { model, Schema } from 'mongoose';

const PriceListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ranges: {
    type: [Schema.Types.Mixed],
    required: true,
    of: {
      range: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  },
});
const PriceList = model('PriceList', PriceListSchema);
export default PriceList;
