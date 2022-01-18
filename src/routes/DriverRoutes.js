import { Router } from "express";
import { generatePassword, isBoss, isManager, Logger, mailer } from "../helpers";
import { RegionByName } from "../middlewares";
import { BossModel, DriverModel, ManagerModel } from "../models";

const route = Router();


route.post('/add', isManager, async (req, res, next) => {
    try {
        const { email, name, car } = req.body;
        const password = await generatePassword();
        const driver = (await DriverModel.create({ name, email, password, car })).toObject();
        delete driver.password

        //events needed 
        mailer.emit('New User Added', { ...driver, password });
        Logger.emit('Make Log', { req, target: driver });

        //response
        res.json(driver)
    } catch (error) {
        next(error)
    }
});


export { route as DriverRoutes };