import express from "express";
import mongoose from "mongoose";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.lastName,
            region: req.body.region,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            settlement: req.body.settlement
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

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (e) {
        next(e);
    }
});

export default usersRouter;