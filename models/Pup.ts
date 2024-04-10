import {model, Schema} from "mongoose";

const PUPSchema = new Schema({

    region: {
        type: String,
        required: true,
        enum: ['Чуй', 'Иссык-Куль', 'Талас', 'Нарны', 'Джалал-Абад', 'Ош', 'Баткен'],
    },

    settlement: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    }

}, { versionKey: false });

const PUP = model('PUP', PUPSchema);

export default PUP;