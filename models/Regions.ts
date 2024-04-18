import { model, Schema } from 'mongoose';

const RegionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Region = model('Region', RegionSchema);
export default Region;
