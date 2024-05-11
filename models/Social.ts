import { model, Schema } from 'mongoose';

const SocialSchema = new Schema({
  link: {
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
