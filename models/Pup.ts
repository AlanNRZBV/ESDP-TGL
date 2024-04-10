import { model, Schema } from "mongoose";

const PUPSchema = new Schema({
    region: {
        type: String,
        enum: ['Чуй', 'Иссык-Куль', 'Талас', 'Нарын', 'Джалал-Абад', 'Ош', 'Баткен'],
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
