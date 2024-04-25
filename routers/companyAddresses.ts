import { Router } from 'express';
import CompanyAddress from '../models/CompanyAddress';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import { CompanyAddressData } from '../types/companyAddress.types';
import PUP from '../models/Pup';
import mongoose from 'mongoose';

const companyAddressesRouter = Router();

companyAddressesRouter.get('/', async (req, res, next) => {
  try {
    const address = await CompanyAddress.findOne();
    if (!address) {
      return res.status(404).send({ error: 'Адрес не найден', data: {} });
    }
    return res.send({ message: 'Адрес успешно загружен', data: address });
  } catch (e) {
    next(e);
  }
});

companyAddressesRouter.post('/add', auth, permit('super'), async (req, res, next) => {
  try {
    const newAddress: CompanyAddressData = {
      address: req.body.address,
      city: req.body.city,
      district: req.body.district,
      postCode: req.body.postCode,
    };

    const address = new CompanyAddress(newAddress);
    await address.save();

    return res.send({ message: 'Адрес был успешно добавлен', address });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send({ error: 'Некорректные данные. Отмена операции.' });
    }
    next(e);
  }
});

companyAddressesRouter.put('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const newAddress: CompanyAddressData = {
      address: req.body.address,
      city: req.body.city,
      district: req.body.district,
      postCode: req.body.postCode,
    };

    const address = new CompanyAddress(newAddress);
    await address.save();

    return res.send({ message: 'Адрес был успешно обновлен', address });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send({ error: 'Некорректные данные. Отмена операции.' });
    }
    next(e);
  }
});

companyAddressesRouter.delete('/:id/delete', auth, permit('super'), async (req, res, next) => {
  try {
    const _id = req.params.id;
    const address = await CompanyAddress.findByIdAndDelete(_id);
    if (!address) {
      return res.status(404).send({ message: 'Адрес не найден' });
    }
    return res.send({ message: 'Адрес успешно удален', address });
  } catch (e) {
    next(e);
  }
});

export default companyAddressesRouter;
