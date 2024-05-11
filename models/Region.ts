import { model, Schema } from 'mongoose';

const RegionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  lang: {
    type: String,
    required: true,
    enum: ['ru', 'kg', 'eng'],
  },
});

const Region = model('Region', RegionSchema);
export default Region;
