import mongoose, { model } from 'mongoose';

const BannedCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const BannedCategory = model('BannedCategory', BannedCategorySchema);
export default BannedCategory;
