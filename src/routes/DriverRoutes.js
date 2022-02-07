import { Router } from "express";
import { bonusCalculator, generatePassword, isBoss, isManager, isSuperVisor, Logger, mailer } from "../helpers";
import { Bonus } from "../helpers/events";
import { BossModel, DriverModel, ManagerModel } from "../models";
import { scheduleJob } from "node-schedule";


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

route.get('/all', isManager, async (req, res, next) => {
    try {
        const drivers = await DriverModel.find({});

        //events needed 
        Logger.emit('Make Log', { req });

        res.json(drivers)
    } catch (error) {
        next(error)
    }
})

// route.get('/all', isSuperVisor, async (req, res, next) => {
//     try {
//         const drivers = await DriverModel.find({});

//         //events needed 
//         Logger.emit('Make Log', { req });

//         res.json(drivers)
//     } catch (error) {
//         next(error)
//     }
// })


route.get('/calcule', async (req, res, next) => {
    try {
        const bonus = await bonusCalculator()
        res.json(bonus)
    } catch (error) {
        next(error)
    }
})


export { route as DriverRoutes };

// Your email is: cilol67247@bubblybank.com

// Your password is: sLv489Mi




// //every mounth bonus calculator
// scheduleJob('*/10 * * * * *', async () => {
//     Bonus.emit('new Mouth Record')
// })


// Your email is: xokahi8165@afarek.com

// Your password is: BGtuFLOr