import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import { Filter, UserData } from '../types/user.types';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    const userData: UserData = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      pupID: req.body.pupID,
      role: req.body.role,
      region: req.body.region,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      settlement: req.body.settlement,
    };

    const userReg = new User(userData);

    userReg.generateMarketID();
    userReg.generateToken();
    await userReg.save();

    const user = await User.findById(userReg._id)
      .populate({ path: 'region', select: 'name' })
      .populate({ path: 'pupID', select: 'name address' });
    return res.send({ message: 'Регистрация прошла успешно', user });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

usersRouter.post('/staff', auth, permit('super'), async (req: RequestWithUser, res, next) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      pupID: req.body.pupID,
      region: req.body.region,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      settlement: req.body.settlement,
      role: req.body.role,
    });

    newUser.generateMarketID();
    newUser.generateToken();
    await newUser.save();
    return res.send({ message: 'Пользователь добавлен', newUser });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

usersRouter.get('/staff/:id', async (req, res, next) => {
  try {
    const staffParamsEmail = req.params.id;
    const user = await User.findOne({ email: staffParamsEmail }).select('-token -address');

    if (!user) {
      return res.status(404).send({ message: 'Сотрудник не найден!' });
    }

    return res.send({ message: 'Сотрудник найден!', user });
  } catch (e) {
    return next(e);
  }
});

usersRouter.get('/', async (req, res, next) => {
  try {
    const { region, settlement, role } = req.query;

    const filter: Filter = {};

    if (region) {
      filter.region = region as string;
    }
    if (settlement) {
      filter.settlement = settlement as string;
    }
    if (role) {
      filter.role = role as string;
    }
    const users = await (Object.keys(filter).length > 0
      ? User.find(filter).populate({ path: 'region', select: 'name' })
      : User.find()
          .populate({ path: 'region', select: 'name' })
          .populate({ path: 'pupID', select: 'name address' }));
    return res.send({ message: 'Данные о пользователях', users });
  } catch (e) {
    next(e);
  }
});

usersRouter.get('/clients', auth, permit('admin', 'manager', 'super'), async (req, res, next) => {
  try {
    const marketId = req.query.marketId;

    if (marketId) {
      const isInputValid = (marketIdString: string) => {
        const regex = /^\d{5}$/;
        return regex.test(marketIdString);
      };

      if (!isInputValid(marketId as string)) {
        return res.status(422).send({ message: 'Неверные данные', client: {} });
      }
      const client = await User.findOne({ marketId: marketId })
        .populate('region')
        .populate({ path: 'pupID', populate: { path: 'region' } });
      if (!client) {
        return res.status(404).send({ message: 'Пользователь не найден', client: {} });
      }
      return res.send({ message: 'Пользователь успешно найден', client });
    }

    const clients = await User.find({ role: 'client' })
      .populate('region')
      .populate({ path: 'pupID', populate: { path: 'region' } })
      .sort({ _id: 1 });
    const isEmpty = clients.length < 1;

    if (isEmpty) {
      return res.status(404).send({ message: 'Нет клиентов', clients: clients });
    }
    return res.send({ message: 'Клиенты успешно найдены', clients });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

usersRouter.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select('-token')
      .populate({
        path: 'region',
        select: 'name',
      })
      .populate({ path: 'pupID', select: 'name address' });
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден!' });
    }
    res.send({ message: 'Данные о пользователях', user });
  } catch (error) {
    res.status(500).send({ message: 'Пользователь не найден!' });
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate('region pupID');

    if (!user) {
      return res.status(422).send({ message: 'Пользователь не найден!' });
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(422).send({ message: 'Пароль или почта введены некорректно' });
    }

    user.generateToken();
    await user.save();

    return res.send({ message: 'Данные введены правильно', user });
  } catch (e) {
    next(e);
  }
});

usersRouter.post('/sessions/lastSession', async (req, res, next) => {
  try {
    const user = await User.findOne({ token: req.body.token });

    if (!user) {
      return res.status(422).send({ message: 'Ошибка! Попробуйте войти снова.' });
    }

    user.generateToken();
    await user.save();

    return res.send({ message: 'Вход по последней сессии:', user });
  } catch (e) {
    next(e);
  }
});

usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const headerValue = req.get('Authorization');
    const successMessage = { message: 'Успешная операция!' };

    if (!headerValue) {
      return res.send(successMessage);
    }

    const [_bearer, token] = headerValue.split(' ');

    if (!token) {
      return res.send(successMessage);
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.send(successMessage);
    }

    user.generateToken();
    await user.save();

    return res.send(successMessage);
  } catch (e) {
    return next(e);
  }
});

usersRouter.delete(
  '/:id',
  auth,
  permit('admin', 'super'),
  async (req: RequestWithUser, res, next) => {
    try {
      const role = req.user?.role;
      const itemId = req.params.id;

      const user = await User.findById(itemId);

      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден!' });
      }

      if (user.role === 'client' && role === 'admin') {
        await User.findOneAndDelete({ _id: itemId });
      } else if (role === 'super') {
        await User.findOneAndDelete({ _id: itemId });
      } else {
        return res.status(404).send({ message: 'У вас нет полномочий!' });
      }

      res.send({ message: 'Пользователь был удален' });
    } catch (e) {
      next(e);
    }
  },
);

usersRouter.put('/update', auth, async (req: RequestWithUser, res, next) => {
  try {
    const currentUser = req.user;

    const userToUpdate = await User.findById(currentUser?.id);

    if (!userToUpdate) {
      return res.status(404).send({ message: 'Пользователь не найден!' });
    }

    const user = await User.findByIdAndUpdate(
      { _id: currentUser?._id },
      {
        $set: {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          middleName: req.body.middleName,
          pupID: req.body.pupID,
          region: req.body.region,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          settlement: req.body.settlement,
        },
      },
      { new: true },
    )
      .populate('region')
      .populate('pupID');

    return res.send({ message: 'Данные успешно обновлены', user });
  } catch (e) {
    next(e);
  }
});

usersRouter.patch('/update/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          middleName: req.body.middleName,
          pupID: req.body.pupID,
          region: req.body.region,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          settlement: req.body.settlement,
          role: req.body.role,
        },
      },
      { new: true },
    );
    if (user.matchedCount === 0) {
      return res.status(404).send({ message: 'Пользователь не найден!' });
    }

    return res.send({ message: 'Данные пользователя успешно обновлены!' });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }

    next(e);
  }
});

usersRouter.put('/admin/:id', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден!' });
    }

    if (user.role === 'client' || user.role === 'manager') {
      const user = await User.updateOne(
        { _id: userId },
        {
          $set: {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
            pupID: req.body.pupID,
            region: req.body.region,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            settlement: req.body.settlement,
          },
        },
      );
      return res.send({ message: 'Данные успешно обновлены', user });
    } else {
      return res.status(404).send({ message: 'У вас нет полномочий!' });
    }
  } catch (e) {
    next(e);
  }
});

export default usersRouter;
