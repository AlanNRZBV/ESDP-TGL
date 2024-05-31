import { Router } from 'express';
import BannedCategory from '../models/BannedCategory';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import auth from '../middleware/auth';

interface BannedData {
  name: string;
}

const bannedCategoriesRouter = Router();

bannedCategoriesRouter.get('/', async (req, res, next) => {
  try {
    const response = await BannedCategory.find();
    const isEmpty = response.length < 1;
    if (isEmpty) {
      return res.status(404).send({ message: 'Запрещенных товаров не найдено' });
    }
    return res.send({
      message: 'Запрещенный товары и категории успешно найдены',
      banned: response,
    });
  } catch (e) {
    next(e);
  }
});

bannedCategoriesRouter.post('/', auth, permit('admin', 'super'), async (req, res, next) => {
  try {
    const newItem: BannedData = {
      name: req.body.name,
    };

    const newBanned = new BannedCategory(newItem);
    await newBanned.save();

    return res.send({ message: 'Успешно создано', banned: newBanned });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
      return res.status(402).send('Неверные данные');
    }
    next(e);
  }
});

bannedCategoriesRouter.patch('/:id', auth, permit('admin', 'super'), async (req, res, next) => {
  try {
    const id = req.params.id;

    const banned = await BannedCategory.findById(id);

    if (banned) {
      return res.status(404).send({ message: 'Категория или товар не найден' });
    }

    const updatedItem: BannedData = {
      name: req.body.name,
    };

    const updatedBanned = await BannedCategory.findOneAndUpdate({ _id: id }, updatedItem, {
      new: true,
    });

    return res.send({ message: 'Успешно обновлено', banned: updatedBanned });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
      return res.status(402).send('Неверные данные');
    }
    next(e);
  }
});

bannedCategoriesRouter.delete('/:id', auth, permit('admin', 'super'), async (req, res, next) => {
  try {
    const id = req.params.id;

    const banned = await BannedCategory.findById(id);

    if (banned) {
      return res.status(404).send({ message: 'Категория или товар не найден' });
    }

    const deleted = await BannedCategory.findOneAndDelete({ _id: id });
    return res.send({ message: 'Успешно удалено', banned: deleted });
  } catch (e) {
    next(e);
  }
});

export default bannedCategoriesRouter;
