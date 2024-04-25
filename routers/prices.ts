import { Router } from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Price from '../models/Price';
import { PriceType } from '../types/price.types';

export const pricesRouter = Router();

pricesRouter.get('/', auth, permit('super', 'admin'), async (_req, res, next) => {
  try {
    const price = await Price.findOne();
    return res.send({ message: 'Данные о курсе валюта и цене за доставку', price });
  } catch (e) {
    next(e);
  }
});

pricesRouter.post('/', auth, permit('super'), async (req, res, next) => {
  try {
    const existingPrice = await Price.findOne();

    if (!existingPrice) {
      const priceData: PriceType = {
        exchangeRate: parseFloat(req.body.exchangeRate),
        deliveryPrice: parseFloat(req.body.deliveryPrice),
      };
      const price = new Price(priceData);
      await price.save();
      return res.send({ message: 'Курс валюты и цена за доставку успешно установлены', price });
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

    const price = await Price.findByIdAndUpdate(
      priceId,
      {
        exchangeRate: parseFloat(req.body.exchangeRate),
        deliveryPrice: parseFloat(req.body.deliveryPrice),
      },
      { new: true },
    );

    return res.send({ message: 'Данные успешно обновлены', price });
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

    const price = await Price.findByIdAndDelete(priceId);

    if (!price) {
      return res.status(404).send({ message: 'Данные не найдены' });
    }

    return res.send({ message: 'Данные удалены', price });
  } catch (e) {
    return next(e);
  }
});
