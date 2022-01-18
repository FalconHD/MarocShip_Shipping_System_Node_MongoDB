import { Router } from "express";
import { generatePassword, isManager, Logger, mailer } from "../helpers";
import { SuperVisorModel } from "../models";

const route = Router();


route.post('/add', isManager, async (req, res, next) => {
    try {
        const { email, name } = req.body;
        const password = await generatePassword();
        const manager = (await SuperVisorModel.create({ name, email, password })).toObject();
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


export { route as SuperVisorRoutes };

// Email : hiyape7569@leezro.com
// password : r7qgfR94