import mongoose from "mongoose";
import { Router } from 'express';

// import auth, {RequestWithUser} from "../middleware/auth";
// import permit from "../middleware/permit";
import {PupTypes} from "../types";
import Pup from "../models/Pup";
import permit from "../middleware/permit";
import auth, {RequestWithUser} from "../middleware/auth";


export const pupRouter = Router();

pupRouter.post('/', auth, permit('admin'), async (req:RequestWithUser, res, next) => {
    try {
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