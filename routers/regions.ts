import { Router } from 'express';
import Region from '../models/Region';
import permit from '../middleware/permit';
import auth from '../middleware/auth';
import { RegionData } from '../regions.type';

const regionsRouter = Router();

regionsRouter.get('/', async (req, res, next) => {
  try {
    const regions = await Region.find();
    if (regions.length < 1) {
      return res.status(404).send({ error: 'Не найдено ни одного региона. Попробуйте позже' });
    }
    return res.send(regions);
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
  } catch (e) {
    next(e);
  }
});

regionsRouter.patch('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const regionId = { id: req.params.id };
    const updateData = { name: req.body.name };
    const updatedRegion = await Region.findOneAndUpdate(regionId, updateData, { new: true });
    return res.send(updatedRegion);
  } catch (e) {
    next(e);
  }
});

regionsRouter.delete('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const regionId = { id: req.params.id };
    const deletedRegion = await Region.findOneAndDelete(regionId);
    return res.send(deletedRegion);
  } catch (e) {
    next(e);
  }
});

export default regionsRouter;
