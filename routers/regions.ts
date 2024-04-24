import { Router } from 'express';
import Region from '../models/Region';
import permit from '../middleware/permit';
import auth from '../middleware/auth';
import { RegionData } from '../types/regions.types';
import mongoose from 'mongoose';

const regionsRouter = Router();

regionsRouter.get('/', async (req, res, next) => {
  try {
    const regions = await Region.find();
    if (regions.length < 1) {
      return res.status(404).send({ message: 'Не найдено ни одного региона. Попробуйте позже' });
    }
    return res.send({ message: 'Список регионов', regions });
  } catch (e) {
    next(e);
  }
});

regionsRouter.post('/add', auth, permit('super'), async (req, res, next) => {
  try {
    const newRegion: RegionData = {
      name: req.body.name,
      lang: req.body.lang,
    };

    const region = new Region(newRegion);
    await region.save();
    return res.send({ message: `Регион ${region.name} успешно создан`, region });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

regionsRouter.patch('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const regionId = { _id: req.params.id };
    const updateData: RegionData = { name: req.body.name, lang: req.body.lang };
    const updatedRegion = await Region.findOneAndUpdate(regionId, updateData, { new: true });

    if (!updatedRegion) {
      return res.status(404).send({ message: 'Регион не найден' });
    }

    return res.send({ message: 'Данные успешно обновлены', updatedRegion });
  } catch (e) {
    next(e);
  }
});

regionsRouter.delete('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const regionId = { _id: req.params.id };
    const deletedRegion = await Region.findOneAndDelete(regionId);

    if (!deletedRegion) {
      return res.status(404).send({ message: 'Регион не найден' });
    }

    return res.send({ message: 'Регион успешно удален', deletedRegion });
  } catch (e) {
    next(e);
  }
});

export default regionsRouter;
