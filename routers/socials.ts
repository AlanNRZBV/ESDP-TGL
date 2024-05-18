import { Router } from 'express';
import Social from '../models/Social';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import { imageUpload } from '../multer';
import { SocialData } from '../types/socials.types';
import * as fs from 'fs';
import mongoose, { Types } from 'mongoose';

const socialsRouter = Router();

socialsRouter.get('/', async (req, res, next) => {
  try {
    const socials = await Social.find();
    const isEmpty = socials.length < 1;
    if (isEmpty) {
      return res.status(404).send({ message: 'В базе данных нет записей', socials: [] });
    }

    return res.send({ message: 'Данные социальных сетей успешно загружены', socials });
  } catch (e) {
    next(e);
  }
});

socialsRouter.get('/:id', async (req, res, next) => {
  try {
    let _id: Types.ObjectId;
    try {
      _id = new Types.ObjectId(req.params.id);
    } catch {
      return res.status(404).send({ error: 'Неправильный ID' });
    }

    const social = await Social.findById(_id);

    if (!social) {
      return res.status(404).send({ error: 'Ни одной социальной сети не было найдено' });
    }

    res.send(social);
  } catch (e) {
    next(e);
  }
});

socialsRouter.post(
  '/',
  auth,
  permit('super'),
  imageUpload.single('image'),
  async (req, res, next) => {
    try {
      const socialData: SocialData = {
        name: req.body.name,
        link: req.body.link,
        image: req.file ? req.file.filename : null,
      };
      const newSocial = new Social(socialData);
      await newSocial.save();
      return res.send({ message: 'Данные успешно добавлены', newSocial });
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
        return res.status(422).send(e);
      }
      next(e);
    }
  },
);

socialsRouter.patch(
  '/:id',
  auth,
  permit('super'),
  imageUpload.single('image'),
  async (req, res, next) => {
    try {
      const filter = req.params.id;
      const isExists = await Social.findById(filter);

      if (!isExists) {
        return res.status(404).send({ message: 'Такой записи не существует', socials: {} });
      }

      const updateData: SocialData = {
        name: req.body.name,
        link: req.body.link,
        image: req.body.image,
      };

      const updatedSocial = await Social.findOneAndUpdate({ _id: filter }, updateData, {
        new: true,
      });
      return res.send({ message: 'Данные были успешно обновлены', socials: updatedSocial });
    } catch (e) {
      next(e);
    }
  },
);
socialsRouter.delete('/:id', auth, permit('super'), async (req, res, next) => {
  try {
    const filter = req.params.id;
    const isExists = await Social.findById(filter);

    if (!isExists) {
      return res.status(404).send({ message: 'Такой записи не существует', socials: {} });
    }

    const imagePath = isExists.image;

    const updatedSocial = await Social.findOneAndDelete({ _id: filter });

    const isImageExists = isExists.image !== '';
    if (isImageExists) {
      fs.unlinkSync(`public/${imagePath}`);
    }

    return res.send({ message: 'Данные были успешно удалены', socials: updatedSocial });
  } catch (e) {
    next(e);
  }
});

export default socialsRouter;
