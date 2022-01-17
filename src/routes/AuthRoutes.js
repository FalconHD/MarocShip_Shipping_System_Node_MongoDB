import { Router } from "express"
import { checkPassword, generateToken, randomToken } from "../helpers";
import { } from "../middlewares";
import { BossModel } from "../models";



const router = Router();
const roles = {
    BOSS: {
        model: BossModel,
        secret: process.env.BOSS_JWT_SECRET,
    },
    MANAGER: {
        model: BossModel,
        secret: process.env.MANAGER_JWT_SECRET,
    },
    SUERVISOR: {
        model: BossModel,
        secret: process.env.SUERVISOR_JWT_SECRET,
    },
    DRIVER: {
        model: BossModel,
        secret: process.env.DRIVER_JWT_SECRET,
    }
}


router.get('/token', async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw new Error("no token")
        const { id, role: UserRole } = randomToken(req.headers.authorization.split(" ")[1])
        const { model, secret } = roles[UserRole]
        const user = (await model.findById(id)).toObject()
        user.role = UserRole
        delete user.password
        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const accounts = await Promise.all([{ model: BossModel, role: "BOSS" }]
            .map(async ({ model, role }) => {
                return {
                    user: (await model.findOne({ email: email })).toObject(),
                    role
                }
            }))


        let admin = accounts.filter(item => item.user !== null)[0];
        if (accounts.length > 1) throw new Error("multi accounts with the same email bro help 👩‍🦯")
        if (admin) {
            const isValid = await checkPassword(password, admin.user.password)
            if (isValid) {
                req.User = admin.user
                console.log(admin.user._id.toString());
                const token = generateToken(admin.user, roles[admin.role].secret, admin.role)
                admin.role = admin.role
                delete admin.user.password
                res.json({
                    data: admin,
                    token
                })
            } else {
                res.json({
                    message: "Invalid password"
                })
            }
        } else {
            res.json({
                message: "Invalid email"
            })
        }
    } catch (error) {
        next(error)
    }

})


export { router as AuthRoutes }