import { Router } from 'express';
import auth, { RequestWithUser } from '../middleware/auth';
import PriceList from '../models/PriceList';
import permit from '../middleware/permit';
import { PriceListsData } from '../types/priceLists.types';
import mongoose from 'mongoose';

const priceListsRouter = Router();

priceListsRouter.get(
  '/',
  auth,
  permit('super', 'admin', 'manager'),
  async (req: RequestWithUser, res, next) => {
    try {
      const priceLists = await PriceList.find();
      const isEmpty = priceLists.length < 1;
      if (isEmpty) {
        return res.status(404).send({ message: 'Данных не найдено', priceLists: [] });
      }
      return res.send({ message: 'Данные успешно загружены', priceLists });
    } catch (e) {
      next(e);
    }
  },
);

priceListsRouter.post('/', auth, permit('super'), async (req, res, next) => {
  try {
    const newPriceList: PriceListsData = {
      name: req.body.name,
      ranges: req.body.ranges,
    };

    const priceList = new PriceList(newPriceList);
    await priceList.save();
    return res.send({ message: 'Прайс лист успешно создан', priceList });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    } else if (e instanceof mongoose.Error.CastError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

priceListsRouter.patch('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const id = req.params.id;

    const isExists = await PriceList.findById(id);

    if (!isExists) {
      return res.status(404).send({ message: 'Данные не найдены', priceList: {} });
    }

    const newPriceList: PriceListsData = {
      name: req.body.name,
      ranges: req.body.ranges,
    };

    const priceList = await PriceList.findOneAndUpdate({ _id: id }, newPriceList, { new: true });
    return res.send({ message: 'Прайс лист успешно изменен', priceList });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    } else if (e instanceof mongoose.Error.CastError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

priceListsRouter.delete('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const id = req.params.id;

    const isExists = await PriceList.findById(id);

    if (!isExists) {
      return res.status(404).send({ message: 'Данные не найдены', priceList: {} });
    }

    const priceList = await PriceList.findOneAndDelete({ _id: id });

    return res.send({ message: 'Данные успешно удалены', priceList });
  } catch (e) {
    next(e);
  }
});
export default priceListsRouter;
