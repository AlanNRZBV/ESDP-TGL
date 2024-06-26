import { Router } from 'express';
import CompanyAddress from '../models/CompanyAddress';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import { CompanyAddressData } from '../types/companyAddress.types';
import mongoose from 'mongoose';

const companyAddressesRouter = Router();

companyAddressesRouter.get('/', async (req, res, next) => {
  try {
    const address = await CompanyAddress.find();
    if (address.length < 1) {
      return res.send({ message: 'Список адресов пуст или не найден', addresses: [] });
    }
    return res.send({ message: 'Адрес успешно загружен', addresses: address });
  } catch (e) {
    next(e);
  }
});

companyAddressesRouter.get('/:id', async (req, res, next) => {
  try {
    const params = req.params.id;
    const address = await CompanyAddress.findById(params);
    return res.send({ message: 'Поиск по 1 адресу:', address: address });
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

companyAddressesRouter.patch('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const { id, data } = req.body;
    const check = await CompanyAddress.findById(id);

    if (!check) {
      return res.status(404).send({ error: 'Неверные данные' });
    }

    const newData: CompanyAddressData = {
      address: data.address,
      city: data.city,
      district: data.district,
      postCode: data.postCode,
    };

    const newAddress = await CompanyAddress.findOneAndUpdate({ _id: id }, newData, { new: true });

    console.log(newAddress);

    return res.send({ message: 'Адрес был успешно обновлен', newAddress });
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
