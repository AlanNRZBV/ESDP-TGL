import { model, Schema } from 'mongoose';
const PUPSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    region: {
      type: String,
      required: true,
      enum: [
        'Чуйская',
        'Иссык-Кульская',
        'Таласская',
        'Нарынская',
        'Джалал-Абадская',
        'Ошская',
        'Баткенская',
      ],
    },

    settlement: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    phoneNumber: Number,

    isChina: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false },
);

const PUP = model('PUP', PUPSchema);
export default PUP;
