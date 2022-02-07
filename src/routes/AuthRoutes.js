import { Router } from "express"
import { checkPassword, generateToken, randomToken } from "../helpers";
import { } from "../middlewares";
import { BossModel, ManagerModel, DriverModel, SuperVisorModel } from "../models";



const router = Router();
const roles = {
    BOSS: {
        model: BossModel,
        secret: process.env.BOSS_JWT_SECRET,
    },
    MANAGER: {
        model: ManagerModel,
        secret: process.env.MANAGER_JWT_SECRET,
    },
    SUPERVISOR: {
        model: SuperVisorModel,
        secret: process.env.SUPERVISOR_JWT_SECRET,
    },
    DRIVER: {
        model: DriverModel,
        secret: process.env.DRIVER_JWT_SECRET,
    }
}


router.get('/token', async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw new Error("no token")
        const { id, role: UserRole } = randomToken(req.headers.authorization.split(" ")[1])
        const { model, secret } = roles[UserRole]
        const user = (await model.findById(id)).toObject()
        delete user.password
        res.json({
            data: {
                user: user,
                role: UserRole,
            },
            token: req.headers.authorization.split(" ")[1]
        })
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const accounts = await Promise.all([
            { model: BossModel, role: "BOSS" },
            { model: ManagerModel, role: "MANAGER" },
            { model: SuperVisorModel, role: "SUPERVISOR" },
            { model: DriverModel, role: "DRIVER" },
        ]
            .map(async ({ model, role }) => {
                return {
                    user: await model.findOne({ email: email }),
                    role
                }
            }))

        let admin = accounts.filter(item => item.user ? true : false);
        if (admin?.length > 1) throw new Error("multi accounts with the same email bro help 👩‍🦯")
        admin = admin[0]
        if (admin) {
            const isValid = await checkPassword(password, admin.user.password)
            if (isValid) {
                req.User = admin.user
                const token = generateToken(admin.user, roles[admin.role].secret, admin.role)
                admin.user = admin.user.toObject()
                delete admin.user.password
                res.json({
                    data: admin,
                    token
                })
            } else {
                res.status(401)
                throw new Error("password is not correct")
            }
        } else {
            res.status(401)
            throw new Error("Invalid email")
        }
    } catch (error) {
        next(error)
    }

})


export { router as AuthRoutes }