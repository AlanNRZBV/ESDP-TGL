import {model, Schema} from "mongoose";

const PUPSchema = new Schema({
    region: {
        type: String,
        required: true,
        enum: ['Чуйская', 'Иссык-Кульская', 'Таласская', 'Нарынская', 'Джалал-Абадская', 'Ошская', 'Баткенская'],
    },

    settlement: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },
}, { versionKey: false });

const PUP = model('PUP', PUPSchema);

export default PUP;