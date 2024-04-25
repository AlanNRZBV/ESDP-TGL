import mongoose from 'mongoose';
import { Router } from 'express';
import Pup from '../models/Pup';
import PUP from '../models/Pup';
import permit from '../middleware/permit';
import auth, { RequestWithUser } from '../middleware/auth';
import { PupData, PupDataMutation } from '../types/pups.types';

export const pupsRouter = Router();

pupsRouter.post('/', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  const pupName = 'ПВЗ№';
  const pupNumber = (await PUP.find()).length;
  try {
    const pupData: PupData = {
      name: pupName + (pupNumber + 1),
      region: req.body.region,
      settlement: req.body.settlement,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
    };

    const pup = new Pup(pupData);
    await pup.save();

    return res.send({ message: `${pupData.name} успешно добавлен`, pup });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

pupsRouter.get('/', async (_req, res, next) => {
  try {
    const pups = await PUP.find().populate('region', 'name lang');

    return res.send({ message: 'Список ПВЗ', pups });
  } catch (e) {
    next(e);
  }
});

pupsRouter.delete('/:id', auth, permit('admin'), async (_req, res, next) => {
  try {
    const _id = _req.params.id;
    const pup = await PUP.findByIdAndDelete(_id);
    if (!pup) {
      return res.status(404).send({ message: 'ПВЗ не найден' });
    }
    return res.send({ message: 'ПВЗ успешно удален', pup });
  } catch (e) {
    next(e);
  }
});
pupsRouter.put('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const updateData: PupDataMutation = {
      name: req.body.name,
      settlement: req.body.settlement,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
    };

    const findPup = await PUP.findByIdAndUpdate({ _id: req.params.id }, updateData,{ new: true });
    if (!findPup) {
      return res.status(404).send({ message: 'PUP id not found' });
    }

    res.send({ message: 'PUPs status toggled successfully' });
  } catch (e) {
    next(e);
  }
});

export default pupsRouter;
