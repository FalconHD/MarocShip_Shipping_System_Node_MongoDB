import bcrypt from "bcrypt"
import { verifyToken, generateToken, isTokenValid, randomToken } from "./jwt";


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
            const tokensData = verifyToken(req.headers.authorization.split(" ")[1], process.env.SUERVISOR_JWT_SECRET)
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



//jwt helpers

export { verifyToken, generateToken, isTokenValid, randomToken } from "./jwt";
export { mailer, Logger } from "./events";