import { Router } from 'express';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import Warehouse from '../models/Warehouse';
import { WarehouseTypes } from '../types/warehouse.types';
import mongoose, { Types } from 'mongoose';

const warehousesRouter = Router();

warehousesRouter.get('/', auth, async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find();
    if (warehouses.length < 0) {
      return res.status(404).send({ message: 'Ни одного склада не было найдено!' });
    }
    return res.send({ message: 'Список складов успешно загружен', warehouses: warehouses });
  } catch (e) {
    next(e);
  }
});

warehousesRouter.get('/:id', auth, async (req, res, next) => {
  try {
    let _id: Types.ObjectId;
    try {
      _id = new Types.ObjectId(req.params.id);
    } catch {
      return res.status(404).send({ error: 'Неправильный ID' });
    }

    const warehouse = await Warehouse.findById(_id);

    if (!warehouse) {
      return res.status(404).send({ error: 'Ни одного склада не было найдено' });
    }

    res.send(warehouse);
  } catch (e) {
    next(e);
  }
});

warehousesRouter.post('/add', auth, permit('super'), async (req, res, next) => {
  try {
    const newWarehouse: WarehouseTypes = {
      name: req.body.name,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
    };
    const warehouse = new Warehouse(newWarehouse);
    await warehouse.save();

    res.send({ message: 'Склад успешно добавлен', warehouse });
  } catch (e) {
    next(e);
  }
});

warehousesRouter.patch('/:id', auth, permit('super'), async (req: RequestWithUser, res, next) => {
  try {
    const result = await Warehouse.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          address: req.body.address,
          phoneNumber: req.body.phoneNumber,
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Нет совпадений' });
    }
    return res.send({ message: 'Склад успешно обновлен' });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

warehousesRouter.delete('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const id = req.params.id;

    try {
      new mongoose.Types.ObjectId(id);
    } catch {
      return res.status(404).send({ error: 'Wrong ID!' });
    }

    const result = await Warehouse.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send({ message: 'Склад не найден' });
    }

    return res.send({ message: 'Склад успешно удален' });
  } catch (e) {
    return next(e);
  }
});
export default warehousesRouter;
