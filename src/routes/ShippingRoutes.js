import { Router } from "express";
import { isBoss } from "../helpers";
import { RegionByName } from "../middlewares";

const route = Router();



route.post('/',RegionByName, async (req, res, next) => {
    try {
        res.json(req.Region);
        delete res.Region
    } catch (error) {
        next(error)
    }
});


export { route as ShipRoutes };