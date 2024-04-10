import {model, Schema} from "mongoose";

const PUPSchema = new Schema({

    region: {
        type: String,
        required: true,
        enum: ['Chuy', 'Ysyk-Kol', 'Talas', 'Naryn', 'Jalal-Abad', 'Osh', 'Batken'],
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