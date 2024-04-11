import { model, Schema } from "mongoose";

const PUPSchema = new Schema({
    region: {
        type: String,
        enum: ['Чуйская', 'Иссык-Кульская', 'Таласская', 'Нарынская', 'Джалал-Абадская', 'Ошская', 'Баткенская'],
        required: true
    },

    settlement: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    }
});

const PUP = model('PUP', PUPSchema);

export default PUP;
