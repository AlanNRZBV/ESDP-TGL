import mongoose from 'mongoose';
import { Router } from 'express';
import Pup from '../models/Pup';
import PUP from '../models/Pup';
import permit from '../middleware/permit';
import auth, { RequestWithUser } from '../middleware/auth';

export const pupsRouter = Router();

pupsRouter.post('/', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  const pupName = 'ПВЗ№';
  const pupNumber = (await PUP.find()).length;
  try {
    const pup = new Pup({
      name: pupName + (pupNumber + 1),
      region: req.body.region,
      settlement: req.body.settlement,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
    });
    await pup.save();
    return res.send({ message: 'Pup is correctly added!', pup });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

pupsRouter.get('/', async (_req, res, next) => {
  try {
    const pups = await PUP.find();
    return res.send(pups);
  } catch (e) {
    next(e);
  }
});

pupsRouter.delete('/:id', auth, permit('admin'), async (_req, res, next) => {
  const _id = _req.params.id;
  try {
    const pups = await PUP.findByIdAndDelete(_id);
    if (!pups) {
      return res.status(404).send({ message: 'PUP not found' });
    }
    return res.send({ message: 'PUP successfully deleted' });
  } catch (e) {
    next(e);
  }
});
pupsRouter.put('/:id', auth, permit('admin'), async (_req, res) => {
  try {
    const _id = _req.params.id;
    const pup = await PUP.findById(_id);
    if (!pup) {
      return res.status(404).send({ message: 'PUP id not found' });
    }

    pup.isChina = !pup.isChina;
    await pup.save();

    res.send({ message: 'PUPs status toggled successfully' });
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default pupsRouter;
