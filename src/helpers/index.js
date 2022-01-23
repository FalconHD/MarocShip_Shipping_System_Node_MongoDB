import bcrypt from "bcrypt"
import fs from "fs"
import { verifyToken, generateToken, isTokenValid, randomToken } from "./jwt";
import ejs from "ejs";
import { DriverModel } from "../models";


export const trycatch = (cb, req, res, next) => {
    try {
        cb(req, res);
    } catch (error) {
        next(error)
    }
}

export const isBoss = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const tokensData = verifyToken(req.headers.authorization.split(" ")[1], process.env.BOSS_JWT_SECRET)
            if (tokensData && tokensData.role === 'BOSS') {
                req.User = tokensData
                next()
            } else {
                res.status(403).json({
                    message: 'You Are Not A Boss Bro 💪'
                })
            }
        } else {
            next(new Error('No token provided'))
        }
    } catch (error) {
        next(error)
    }
}

export const isManager = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const tokensData = verifyToken(req.headers.authorization.split(" ")[1], process.env.MANAGER_JWT_SECRET)
            if (tokensData && tokensData.role === 'MANAGER') {
                req.User = tokensData
                next()
            } else {
                res.status(403).json({
                    message: 'You Are Not A Manager Bro 👨‍✈️'
                })
            }
        } else {
            next(new Error('No token provided'))
        }
    } catch (error) {
        next(error)
    }
}

export const isSuperVisor = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const tokensData = verifyToken(req.headers.authorization.split(" ")[1], process.env.SUPERVISOR_JWT_SECRET)
            if (tokensData && tokensData.role === 'SUPERVISOR') {
                req.User = tokensData
                next()
            } else {
                res.status(403).json({
                    message: 'You Are Not A SuperVisor Bro 🦹'
                })
            }
        } else {
            next(new Error('No token provided'))
        }
    } catch (error) {
        next(error)
    }
}

export const isDriver = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const tokensData = verifyToken(req.headers.authorization.split(" ")[1], process.env.DRIVER_JWT_SECRET)
            if (tokensData && tokensData.role === 'DRIVER') {
                req.User = tokensData
                next()
            } else {
                res.status(403).json({
                    message: 'You Are Not A Driver Bro 🚙'
                })
            }
        } else {
            next(new Error('No token provided'))
        }
    } catch (error) {
        next(error)
    }
}


export const bonusCalculator = async () => {
    const drivers = await DriverModel.aggregate([
        {
            $lookup: {
                from: "commands",
                localField: "deliveries",
                foreignField: "_id",
                as: "deliveries",
            },
        },
        {
            $project: {
                prices: {
                    $sum: {
                        $map:
                        {
                            input: "$deliveries.price",
                            as: "price",
                            in: {
                                $toInt: {
                                    $arrayElemAt: [
                                        {
                                            $split: ["$$price", " "]
                                        }, 0]
                                }
                            }
                        }
                    }
                },
                distances: {
                    $sum: {
                        $map:
                        {
                            input: "$deliveries.distance",
                            as: "distance",
                            in: {
                                $toInt: "$$distance",
                            }
                        }
                    }
                },
            },
        },
        {
            $project: {
                totalBonus: {
                    total: {
                        "$switch": {
                            "branches": [
                                {
                                    "case": { $range: [1000, "$distances", 2000] }, "then": {
                                        $multiply: ["$prices", 0.15],
                                    }
                                },
                                {
                                    "case": { $range: [2000, "$distances", 2500] }, "then": {
                                        $multiply: ["$prices", 0.22],
                                    }
                                },
                                {
                                    "case": { "$gte": ["$distances", "2500"] }, "then": {
                                        $multiply: ["$prices", 0.300],
                                    }
                                },
                            ],
                            "default": 10
                        }
                    },
                    date: (new Date()).toISOString().split('T')[0],
                }
            }
        }
    ]);

    await Promise.all(drivers.map(async (driver) => {
        const bonus = await DriverModel.findByIdAndUpdate(driver._id, {
            $push: {
                bonus: driver.totalBonus
            }
        })
        return bonus
    }))

    const final = await DriverModel.aggregate(([
        {
            $project: {
                name: 1,
                email: 1,
                bonus: {
                    $slice: ["$bonus", -1]
                }
            },
        },
        {
            $sort: {
                "bonus.total": -1
            }
        }
    ]))
    console.log(final);
    return final
}



//password helpers

export const checkPassword = async (password, passwordHash) => {
    const match = await bcrypt.compare(password, passwordHash);
    if (match) {
        return true
    }
    return false
}


export const hashPassword = async (password) => await bcrypt.hash(password, 10);

export const generatePassword = async () => {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var length = 8;
    var retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

//view render 
export const renderView = async (page, data) => {
    let htmlContent = fs.readFileSync(`views/${page}.ejs`, 'utf8');
    let htmlRenderized = ejs.render(htmlContent, { filename: `${page}.ejs`, data });
    return htmlRenderized;
}

//jwt helpers

export { verifyToken, generateToken, isTokenValid, randomToken } from "./jwt";
export { mailer, Logger } from "./events";