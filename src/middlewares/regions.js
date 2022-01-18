import { get, post } from "axios";


export const RegionByName = async (req, res, next) => {
    get((`${process.env.REGIONS_URI}/name/${req.body.name}`)).then(response => {
        req.Region = response.data[0];
        next();
    }).catch(() => {
        res.status(404)
        req.Region = {
            message: "Region Not Found"
        };
        next();
    })
}