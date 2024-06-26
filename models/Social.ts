import { model, Schema } from 'mongoose';

const SocialSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    unique: true,
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Social = model('Social', SocialSchema);

export default Social;
