import express, { Response } from 'express';
import mongoose, { FilterQuery } from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import Shipment from '../models/Shipment';
import {
  DeliveryData,
  ShipmentData,
  ShipmentKeys,
  ShipmentStatusData,
} from '../types/shipment.types';
import Price from '../models/Price';
import PUP from '../models/Pup';
import dayjs from 'dayjs';

const shipmentsRouter = express.Router();

const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month').toDate();
const endOfLastMonth = dayjs().subtract(1, 'month').endOf('month').toDate();

const startOfYear = dayjs().startOf('year').toDate();
const endOfYear = dayjs().endOf('year').toDate();

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

  const height = parseFloat(req.body.dimensions.height);
  const width = parseFloat(req.body.dimensions.width);
  const length = parseFloat(req.body.dimensions.length);
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

shipmentsRouter.post(
  '/',
  auth,
  permit('admin', 'super'),
  async (req: RequestWithUser, res, next) => {
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
  },
);

shipmentsRouter.get('/', auth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    const regionId = req.query.region as string;
    const pupId = req.query.pupId as string;
    const datetime = req.query.datetime as string;
    const orderByTrackingNumber = req.query.orderByTrackingNumber as string;
    const marketId = req.query.marketId as string;

    if (marketId) {
      const shipments = await Shipment.find({ userMarketId: marketId }).populate(
        'pupId',
        '_id name address settlement region phoneNumber',
      );
      return res.send({ message: 'Список грузов одного пользователя', shipments });
    }

    let filter: FilterQuery<ShipmentData> = {};

    if (regionId) {
      const pups = await PUP.find({ region: regionId });
      const idList = pups.map((pup) => pup._id);

      filter = { pupId: { $in: idList } };
    }

    if (orderByTrackingNumber) {
      const shipment = await Shipment.findOne({ trackerNumber: orderByTrackingNumber });

      return res.send({ message: 'Поиск по трекеру', shipment });
    }

    if (pupId) {
      if (datetime === 'month') {
        const shipments = await Shipment.find({
          pupId,
          datetime: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        })
          .sort({ datetime: -1 })
          .limit(30)
          .populate('userId', 'firstName');
        return res.send({ message: 'Список грузов за последний месяц', shipments });
      }

      if (datetime === 'year') {
        const shipments = await Shipment.find({
          pupId,
          datetime: { $gte: startOfYear, $lte: endOfYear },
        })
          .sort({ datetime: -1 })
          .limit(30)
          .populate('userId', 'firstName');

        return res.send({ message: 'Список грузов за последний год', shipments });
      }
      const shipments = await Shipment.find({ pupId }).limit(30).populate('userId', 'firstName');
      return res.send({ message: 'Список грузов', shipments });
    }

    if (datetime) {
      if (datetime === 'month') {
        const shipments = await Shipment.find({
          datetime: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        })
          .sort({ datetime: -1 })
          .limit(30)
          .populate('userId', 'firstName');
        return res.send({ message: 'Список грузов за последний месяц', shipments });
      }

      if (datetime === 'year') {
        const shipments = await Shipment.find({
          datetime: { $gte: startOfYear, $lte: endOfYear },
        })
          .sort({ datetime: -1 })
          .limit(30)
          .populate('userId', 'firstName');

        return res.send({ message: 'Список грузов за последний год', shipments });
      }
    }

    if (user?.role === 'super' || user?.role === 'admin' || user?.role === 'manager') {
      const shipments = await Shipment.find(filter)
        .populate('userId', 'firstName lastName')
        .populate('pupId', '_id name address settlement region phoneNumber')
        .limit(30);
      return res.send({ message: 'Список грузов', shipments });
    }
  } catch (e) {
    res.send(e);
  }
});

shipmentsRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;

    try {
      new mongoose.Types.ObjectId(id);
    } catch {
      return res.status(404).send({ error: 'Wrong ID!' });
    }

    const shipment = await Shipment.findById(id);

    if (shipment?.userMarketId !== user?.marketId) {
      return res.status(401).send({ message: 'Вы не имеете права удалять чужие грузы!' });
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

shipmentsRouter.put(
  '/:id',
  auth,
  permit('admin', 'super', 'manager'),
  async (req: RequestWithUser, res, next) => {
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
  },
);

shipmentsRouter.patch(
  '/changeStatus',
  auth,
  permit('admin', 'super', 'manager'),
  async (req, res, next) => {
    try {
      const updateData: ShipmentStatusData[] = req.body;

      const single = updateData.map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { status: item.status, isPaid: item.isPaid },
        },
      }));

      const updatedShipments = await Shipment.bulkWrite(single);

      if (!updatedShipments) {
        return res.status(404).send({ message: 'Что-то пошло не так' });
      }

      return res.send({ message: 'Обновлено', shipment: updatedShipments });
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError || mongoose.Error.CastError) {
        return res.status(422).send(e);
      }
      next(e);
    }
  },
);

shipmentsRouter.patch('/:id/toggleDelivery', auth, async (req: RequestWithUser, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;

    const shipment = await Shipment.findById(id);

    const deliveryData: DeliveryData = {
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      date: req.body.date,
    };

    if (shipment?.userId.toString() === user?._id.toString()) {
      const shipmentToUpdate = await Shipment.findOneAndUpdate(
        { _id: id },
        {
          delivery: {
            status: !shipment?.delivery.status,
            address: deliveryData.address,
            phoneNumber: deliveryData.phoneNumber,
            date: deliveryData.date,
          },
        },
        { new: true },
      );
      if (shipment?.delivery.status) {
        return res.send({ message: 'Вы отказались от доставки', shipment: shipmentToUpdate });
      }
      return res.send({ message: 'Доставка успешно заказана', shipment: shipmentToUpdate });
    }
    return res.status(404).send({ error: 'Неверные данные' });
  } catch (e) {
    next(e);
  }
});

export default shipmentsRouter;
