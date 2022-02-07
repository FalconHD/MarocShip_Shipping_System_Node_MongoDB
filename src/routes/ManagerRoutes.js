import { Router } from "express";
import { generatePassword, isBoss, Logger, mailer } from "../helpers";
import { ManagerModel } from "../models";

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


route.get('/', isBoss, async (req, res, next) => {
    try {
        const managers = await ManagerModel.find().select('-password').sort({ createdAt: -1 });
        res.json(managers)
    } catch (error) {
        next(error)
    }

})

export { route as ManagerRoutes };


// Your email is: fafohog470@icesilo.com

// Your password is: R8IFMbfK