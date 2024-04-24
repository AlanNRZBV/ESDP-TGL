import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import { Filter } from '../types/user.types';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
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
    });

    user.generateMarketID();
    user.generateToken();
    await user.save();
    return res.send({ message: 'OK!', user });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

usersRouter.post('/', auth, permit('super', 'admin'), async (req: RequestWithUser, res, next) => {
  try {
    const isSuperAdmin = req.user?.role === 'super';
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
      role: isSuperAdmin ? 'admin' : 'manager',
    });

    newUser.generateMarketID();
    newUser.generateToken();
    await newUser.save();
    return res.send({ message: 'OK!', newUser });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
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
    const users = await (Object.keys(filter).length > 0 ? User.find(filter) : User.find());
    res.send(users);
  } catch (e) {
    next(e);
  }
});

usersRouter.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send('User Not Found');
    }
    res.send(user);
  } catch (error) {
    res.status(500).send('Not Found');
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(422).send({ error: 'User not found!' });
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(422).send({ error: 'Password is wrong!' });
    }

    user.generateToken();
    await user.save();

    return res.send({ message: 'Email and password are correct!', user });
  } catch (e) {
    next(e);
  }
});

usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const headerValue = req.get('Authorization');
    const successMessage = { message: 'Success!' };

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
        return res.status(404).send({ error: 'User not found!' });
      }

      if (user.role === 'client' && role === 'admin') {
        await User.findByIdAndDelete(itemId);
      } else if (role === 'super') {
        await User.findByIdAndDelete(itemId);
      } else {
        return res.status(404).send({ error: 'You cannot delete this user!' });
      }

      res.send({ success: true, message: 'User deleted successfully.' });
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
      return res.status(404).send({ message: 'User not found' });
    }

    await User.updateOne(
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
    );

    return res.send({ message: 'User updated successfully' });
  } catch (e) {
    next(e);
  }
});

usersRouter.put('/:id', auth, permit('super'), async (req: RequestWithUser, res, next) => {
  try {
    const itemId = req.params.id;
    let roleToUpdate = req.body.role;

    const user = await User.findById(itemId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (user.role !== 'admin' && user.role !== 'manager') {
      roleToUpdate = user.role;
    }

    await User.updateOne(
      { _id: itemId },
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
          role: roleToUpdate,
        },
      },
    );

    return res.send({ message: 'User updated successfully' });
  } catch (e) {
    next(e);
  }
});

usersRouter.put('/admin/:id', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (user.role === 'client' || user.role === 'manager') {
      await User.updateOne(
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
    } else {
      return res.status(404).send({ error: 'You cannot update this user!' });
    }

    return res.send({ message: 'User updated successfully' });
  } catch (e) {
    next(e);
  }
});

export default usersRouter;
