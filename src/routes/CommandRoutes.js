import { Router } from "express";
import { generatePassword, isBoss, isSuperVisor, Logger, mailer, renderView } from "../helpers";
import { GeoInfo, calculate } from "../middlewares";
import { BossModel, CommandModel, DriverModel, ManagerModel } from "../models";

const route = Router();


route.post('/add', isSuperVisor, GeoInfo, calculate, async (req, res, next) => {
    try {
        const command = await CommandModel.create({ ...req.body, ...req.GeoInfo, status: "pending" })

        //events needed 
        Logger.emit('Make Log', { req, target: command });
        mailer.emit('New Command Added', { command: command.toObject(), vehicle: req.vehicle });

        res.json(command)

    } catch (error) {
        next(error)
    }
});

route.get('/reserveDelivery', async (req, res, next) => {
    try {
        const { id, driver } = req.query;
        const command = await CommandModel.findById(id);
        if (!command) throw new Error('Command Not Found')
        if (command.status == "pending") {
            const result = await CommandModel.findByIdAndUpdate({ _id: id }, { status: "reserved", driver: driver }, { new: true });
            const driverUpdated = await DriverModel.findByIdAndUpdate({ _id: driver }, { '$addToSet': { 'deliveries': id } }, { new: true });
            res.json(result)
        } else {
            res.status(403).json({
                message: 'Command Already Reserved'
            })
        }

    } catch (error) {
        next(error)
    }
});


export { route as CommandRoutes };