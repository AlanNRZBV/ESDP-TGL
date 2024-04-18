import express from 'express';
import mongoose, { FilterQuery } from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import Shipment from '../models/Shipment';
import { ShipmentData, ShipmentKeys } from '../types/shipment.types';
import Price from '../models/Price';
import PUP from '../models/Pup';

const shipmentsRouter = express.Router();

shipmentsRouter.post('/', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  try {
    const user = req.user;

    const globalPrice = await Price.findOne();

    if (!globalPrice) {
      return res.status(404).send({ message: 'Укажите стоимость' });
    }

    const countPrice: ShipmentKeys = {
      usd: parseFloat(req.body.weight) * globalPrice.deliveryPrice,
      som: parseFloat(req.body.weight) * globalPrice.deliveryPrice * globalPrice.exchangeRate,
    };

    const getDimensions: ShipmentKeys = {
      height: parseFloat(req.body.height),
      width: parseFloat(req.body.width),
      length: parseFloat(req.body.length),
    };

    const newShipment: ShipmentData = {
      userId: user?.id,
      userMarketId: req.body.userMarketId,
      pupId: req.body.pupId ? req.body.pupId : null,
      status: req.body.status,
      dimensions: getDimensions,
      weight: req.body.weight,
      price: countPrice,
      trackerNumber: req.body.trackerNumber,
      isPaid: req.body.isPaid,
    };

    const shipment = new Shipment(newShipment);
    await shipment.save();
    return res.send(shipment);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      res.status(422).send(e);
    }
    next(e);
  }
});

shipmentsRouter.get('/', auth, permit('admin'), async (req, res) => {
  try {
    const regionId = req.query.region as string;

    let filter: FilterQuery<ShipmentData> = {};

    if (regionId) {
      const pups = await PUP.find({ _id: regionId });
      const idList = pups.map((pup) => pup._id);

      filter = { pupId: { $in: idList } };
    }

    const shipments = await Shipment.find(filter);
    return res.send(shipments);
  } catch (e) {
    res.send(e);
  }
});

shipmentsRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const id = req.params.id;

    try {
      new mongoose.Types.ObjectId(id);
    } catch {
      return res.status(404).send({ error: 'Wrong ID!' });
    }

    await Shipment.findByIdAndDelete(id);

    return res.send({ message: 'Груз успешно удален' });
  } catch (e) {
    return next(e);
  }
});

shipmentsRouter.put('/:id', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  try {
    const id = req.params.id;

    try {
      new mongoose.Types.ObjectId(id);
    } catch {
      return res.status(404).send({ error: 'Wrong ID!' });
    }

    const globalPrice = await Price.findOne();

    if (!globalPrice) {
      return res.status(404).send({ message: 'Укажите стоимость' });
    }

    const countPrice: ShipmentKeys = {
      usd: parseFloat(req.body.weight) * globalPrice.deliveryPrice,
      som: parseFloat(req.body.weight) * globalPrice.deliveryPrice * globalPrice.exchangeRate,
    };

    const getDimensions: ShipmentKeys = {
      height: parseFloat(req.body.height),
      width: parseFloat(req.body.width),
      length: parseFloat(req.body.length),
    };

    const result = await Shipment.updateOne(
      { _id: id },
      {
        $set: {
          userId: req.user?.id,
          userMarketId: req.body.userMarketId,
          pupId: req.body.pupId ? req.body.pupId : null,
          status: req.body.status,
          dimensions: getDimensions,
          weight: req.body.weight,
          price: countPrice,
          trackerNumber: req.body.trackerNumber,
          isPaid: req.body.isPaid,
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Груз не найден' });
    }

    return res.send({ message: 'Данные успешно обновлены' });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    return next(e);
  }
});

export default shipmentsRouter;
