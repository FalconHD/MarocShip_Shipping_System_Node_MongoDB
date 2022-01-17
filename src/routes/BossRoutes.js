import { Router } from "express";
import { isBoss, trycatch } from "../helpers";
import { BossModel } from "../models";

const route = Router();



route.get('/', isBoss, async (req, res, next) => {
    try {
        const Boss = await BossModel.find();
        req.id = Boss._id;
        res.json(Boss);
    } catch (error) {
        next(error)
    }
});

route.post('/add', isBoss, async (req, res, next) => {
    try {
        const Boss = await BossModel.create({ ...req.body });
        req.to = Boss.id
        res.json(Boss);
        res.on('finish', function () {
            console.log(`${res.statusCode} ${res.statusMessage}`);
        });

    } catch (error) {
        next(error)
    }
});


route.post('/login', async (req, res, next) => {
    try {
        const Boss = await BossModel.find();
        req.to = Boss.id;
        res.json(Boss);
    } catch (error) {
        next(error)
    }
});


export { route as BossRoutes };