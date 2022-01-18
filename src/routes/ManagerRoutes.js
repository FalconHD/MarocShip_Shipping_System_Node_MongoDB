import { Router } from "express";
import { generatePassword, isBoss, Logger, mailer } from "../helpers";
import { RegionByName } from "../middlewares";
import { BossModel, ManagerModel } from "../models";

const route = Router();


route.post('/add', isBoss, async (req, res, next) => {
    try {
        const { email, name } = req.body;
        const password = await generatePassword();
        const manager = (await ManagerModel.create({ name, email, password })).toObject();
        delete manager.password

        //events needed 
        mailer.emit('New User Added', { ...manager, password });
        Logger.emit('Make Log', { req, target: manager });

        //response
        res.json(manager)
    } catch (error) {
        next(error)
    }
});


export { route as ManagerRoutes };



// Email : xogota4329@liepaia.com
// password : QGj0FLtG