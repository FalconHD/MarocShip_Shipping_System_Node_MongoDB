import { get, post } from "axios";

//handling Geo Info for the delivery
export const GeoInfo = async (req, res, next) => {
    try {
        if (req.body.area.toLowerCase() === 'national') {
            let { data } = await get((`${process.env.DISTANCE_URI}${req.body.from}|${req.body.to}`))

            data.stops.some(stop => stop.type === 'Invalid') ? res.status(400).json({ error: 'Invalid Address' }) : req.GeoInfo = { distance: data.distance }

            req.vehicle = witchCar(+req.body.weight)

            next()
        } else if (req.body.area.toLowerCase() === 'international') {
            let { data: GeoFrom } = await get((`${process.env.REGIONS_URI}/name/${req.body.from}`)).catch(err => {
                next(new Error("Geo Info Error"))
            })
            let { data: GeoTo } = await get((`${process.env.REGIONS_URI}/name/${req.body.to}`))
            req.GeoInfo = { GeoFrom, GeoTo }
            next()
        }
    }
    catch (error) {
        res.status(404)
        req.Region = {
            message: "Info Not Found"
        };
    }
}

const zone = {
    Europe: 160,
    America: 220,
    "South America": 220,
    Asia: 240,
    Africa: 1,
    Australia: 260
}

//Calculating The Price of the delivery
export const calculate = async (req, res, next) => {
    try {
        if (req.body.area.toLowerCase() === 'national') {
            req.GeoInfo.price = `${120 + ((+req.body.weight - 3) * 5)} MAD`
            next()
        } else if (req.body.area.toLowerCase() === 'international') {
            const { data: { data: currenies } } = await get(`${process.env.CURRENCY_URI}`);
            const GeoTo = req.GeoInfo.GeoTo[0]
            console.log(GeoTo.currencies);
            req.GeoInfo = { price: `${+currenies[`${Object.keys(GeoTo.currencies)[0]}`] * (+req.body.weight * zone[GeoTo.continents[0]])} ${Object.keys(GeoTo.currencies)[0]}` }
            console.log(currenies[`${Object.keys(GeoTo.currencies)[0]}`], zone[GeoTo.continents[0]]);
            next()
        }
    }
    catch (error) {
        res.status(404)
        req.Region = {
            message: "Info Not Found"
        };
    }
}

//Car Types with the limit of weight
const witchCar = (weight) => {
    if (weight <= 200) {
        return 'car'
    } else if (weight > 200 && weight <= 800) {
        return 'small_truck'
    } else if (weight > 800 && weight <= 1600) {
        return 'big_truck'
    }
}