import {Router} from "express";
import {Types} from "mongoose";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";
import ShipmentHistory from "../models/ShipmentHistory";
import permit from "../middleware/permit";

const shipmentHistoryRouter = Router();

shipmentHistoryRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const shipmentHistory = new ShipmentHistory({
      userId: req.body.userId,
      shipments: req.body.shipments,
    });

    await shipmentHistory.save();

    return res.send(shipmentHistory);
  } catch (err) {
    return next(err);
  }
});

shipmentHistoryRouter.get('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    let _id: Types.ObjectId;

    try {
      _id = new Types.ObjectId(req.params.id);
    } catch {
      return res.status(422).send({error: 'Wrong objectId!'});
    }

    const shipmentHistory = await ShipmentHistory.findById(_id);

    if (req.user?.role === 'admin' || req.user?._id === _id) {
      return res.send(shipmentHistory);
    }
  } catch (err) {
    return next(err);
  }
});

export default shipmentHistoryRouter;