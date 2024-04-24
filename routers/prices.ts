import { Router } from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Price from '../models/Price';
import { PriceType } from '../types/price.types';

export const pricesRouter = Router();

pricesRouter.get('/', auth, permit('super', 'admin'), async (_req, res, next) => {
  try {
    const priceData = await Price.findOne();
    return res.send({ message: 'Данные о курсе валюта и цене за доставку', priceData });
  } catch (e) {
    next(e);
  }
});

pricesRouter.post('/', auth, permit('super'), async (req, res, next) => {
  try {
    const existingPrice = await Price.findOne();

    if (!existingPrice) {
      const price: PriceType = {
        exchangeRate: parseFloat(req.body.exchangeRate),
        deliveryPrice: parseFloat(req.body.deliveryPrice),
      };
      const priceData = new Price(price);
      await priceData.save();
      return res.send({ message: 'Курс валюты и цена за доставку успешно установлены', priceData });
    } else {
      return res.send({ message: 'В базе данных может быть только одна ценовая категория' });
    }
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }

    next(e);
  }
});

pricesRouter.put('/:id', auth, permit('super', 'admin'), async (req, res, next) => {
  try {
    const priceId = req.params.id;

    try {
      new mongoose.Types.ObjectId(priceId);
    } catch {
      return res.status(404).send({ error: 'Неправильный формат ID!' });
    }

    const newPrice = await Price.findByIdAndUpdate(
      priceId,
      {
        exchangeRate: parseFloat(req.body.exchangeRate),
        deliveryPrice: parseFloat(req.body.deliveryPrice),
      },
      { new: true },
    );

    return res.send({ message: 'Данные успешно обновлены', newPrice });
  } catch (e) {
    next(e);
  }
});

pricesRouter.delete('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const priceId = req.params.id;

    try {
      new mongoose.Types.ObjectId(priceId);
    } catch {
      return res.status(404).send({ error: 'Неправильный формат ID!' });
    }

    const result = await Price.findByIdAndDelete(priceId);

    if (!result) {
      return res.status(404).send({ message: 'Данные не найдены' });
    }

    return res.send({ message: 'Данные удалены', result });
  } catch (e) {
    return next(e);
  }
});
