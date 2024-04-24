import express, { Response } from 'express';
import mongoose, { FilterQuery } from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import Shipment from '../models/Shipment';
import { ShipmentData, ShipmentKeys } from '../types/shipment.types';
import Price from '../models/Price';
import PUP from '../models/Pup';

const shipmentsRouter = express.Router();

const countWeight = (height: number, width: number, length: number, weight: number) => {
  let totalWeight: number;

  const weightByDimensions = (height * width * length) / 6000;

  if (weightByDimensions > weight) {
    totalWeight = weightByDimensions;
  } else {
    totalWeight = weight;
  }

  return totalWeight;
};

const getShipmentData = async (req: RequestWithUser, res: Response) => {
  const user = req.user;

  const height = parseFloat(req.body.height);
  const width = parseFloat(req.body.width);
  const length = parseFloat(req.body.length);
  const weight = parseFloat(req.body.weight);

  const finalWeight = countWeight(height, width, length, weight);

  const globalPrice = await Price.findOne();

  if (!globalPrice) {
    return res.status(404).send({ message: 'Укажите стоимость' });
  }

  const countPrice: ShipmentKeys = {
    usd: finalWeight * globalPrice.deliveryPrice,
    som: finalWeight * globalPrice.deliveryPrice * globalPrice.exchangeRate,
  };

  const getDimensions: ShipmentKeys = {
    height,
    width,
    length,
  };

  return {
    userId: user?.id,
    userMarketId: req.body.userMarketId,
    pupId: req.body.pupId ? req.body.pupId : null,
    status: req.body.status,
    dimensions: getDimensions,
    weight: finalWeight,
    price: countPrice,
    trackerNumber: req.body.trackerNumber,
    isPaid: req.body.isPaid,
  };
};

shipmentsRouter.post('/', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  try {
    const newShipment = await getShipmentData(req, res);
    const shipment = new Shipment(newShipment);
    await shipment.save();
    return res.send({ message: 'Груз успешно добавлен', shipment });
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
    return res.send({ message: 'Список грузов', shipments });
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

    const result = await Shipment.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send({ message: 'Груз не найден' });
    }

    return res.send({ message: 'Груз успешно удален', result });
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

    const newShipment = await getShipmentData(req, res);

    const shipment = await Shipment.findByIdAndUpdate(id, newShipment, { new: true });

    if (!shipment) {
      return res.status(404).send({ message: 'Груз не найден' });
    }

    return res.send({ message: 'Данные успешно обновлены', shipment });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    return next(e);
  }
});

export default shipmentsRouter;
