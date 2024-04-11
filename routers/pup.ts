import mongoose from "mongoose";
import {Router} from 'express';

import {PupTypes} from "../types";
import Pup from "../models/Pup";
import permit from "../middleware/permit";
import PUP from "../models/Pup";
import auth, {RequestWithUser} from "../middleware/auth";

export const pupRouter = Router();

pupRouter.post('/', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
    try {
        if(req.body.region === '' || req.body.settlement === '' || req.body.address === '') {
            return res.status(422).send({message: 'Field is not to be ad empty!'})
        }
        const pupData: PupTypes = {
            region: req.body.region,
            settlement: req.body.settlement,
            address: req.body.address,
        };

        const pup = new Pup(pupData);
        await pup.save();

        return res.send({message: 'Pup is correctly added!', pup});
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(e);
        }
        next(e);
    }
});

pupRouter.get('/', auth, permit('admin'), async (_req, res, next) => {
    try {
        const pup = await PUP.find();
        return res.send(pup);
    } catch (e) {
        next(e);
    }
});
