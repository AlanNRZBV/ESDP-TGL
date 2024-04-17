import { Router } from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Price from '../models/Price';
import { PriceType } from '../types/price.types';

export const priceRouter = Router();

priceRouter.get('/', auth, permit('super', 'admin'), async (_req, res, next) => {
  try {
    const priceData = await Price.findOne();
    return res.send(priceData);
  } catch (e) {
    next(e);
  }
});

priceRouter.post('/', auth, permit('super'), async (req, res, next) => {
  try {
    const price: PriceType = {
      price: parseFloat(req.body.price),
      exchange: parseFloat(req.body.exchange),
    };

    const priceData = new Price(price);
    await priceData.save();

    return res.send(priceData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }

    next(e);
  }
});

priceRouter.put('/:id', auth, permit('super', 'admin'), async (req, res, next) => {
  try {
    const priceId = req.params.id;

    try {
      new mongoose.Types.ObjectId(priceId);
    } catch {
      return res.status(404).send({ error: 'Wrong ID!' });
    }

    const newPrice = await Price.findByIdAndUpdate(
        priceId,
        {
          price: req.body.price,
          exchange: req.body.exchange,
        },
        { new: true },
    );

    return res.send({ message: 'Цена успешно обновлена', newPrice });
  } catch (e) {
    next(e);
  }
});
