import express from 'express';
import mongoose from 'mongoose';
import auth, {RequestWithUser} from '../middleware/auth';
import permit from '../middleware/permit';
import Shipment from '../models/Shipment';

const shipmentsRouter = express.Router();

shipmentsRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  const user = (req as RequestWithUser).user;

  try {
    const shipment = new Shipment({
      user: user._id,
      marketID: req.body.marketID,
      pupID: req.body.pupID,
      status: req.body.status,
      dimensions: req.body.dimensions,
      weight: req.body.weight,
      price: req.body.price,
    });

    await shipment.save();
    return res.send(shipment);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      res.status(422).send(e);
    }
    next(e);
  }
});

shipmentsRouter.get('/', auth, permit('admin'), async (req, res) => {
  try {
    const shipments = await Shipment.find();
    return res.send(shipments);
  } catch (e) {
    res.send(e);
  }
});

export default shipmentsRouter;