import { model, Schema } from 'mongoose';

const WarehouseSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  phoneNumber:{
    type: String,
    required: true
  }
})

const Warehouse = model('Warehouse', WarehouseSchema);
export default Warehouse;