import { Router } from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import Warehouse from '../models/Warehouse';
import { WarehouseTypes } from '../warehouse.types';

const warehouseRouter = Router();

warehouseRouter.get('/', auth, async (req, res, next) => {
  try {
    const warehouse = await Warehouse.find();
    if (warehouse.length < 1) {
      return res.status(404).send({ error: 'Ни одного склада не было найдено.' });
    }
    return res.send(warehouse);
  } catch (e) {
    next(e);
  }
});

warehouseRouter.post('/add', auth, permit('admin', 'super'), async (req, res, next) => {
  try {
    const newWarehouse: WarehouseTypes = {
      name: req.body.name,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
    };
    const warehouse = new Warehouse(newWarehouse);
    await warehouse.save();

    res.send(warehouse);
  } catch (e) {
    next(e);
  }
});
export default warehouseRouter;