import jwt from 'jsonwebtoken';

const roles = [
    process.env.BOSS_JWT_SECRET,
    process.env.MANAGER_JWT_SECRET,
    process.env.SUERVISOR_JWT_SECRET,
    process.env.DRIVER_JWT_SECRET,
]



export const generateToken = ({ _id, email, name }, secret, role) => {
    const token = jwt.sign({
        id: _id,
        email,
        role,
        name
    }, secret, {
        expiresIn: '24h'
    })
    return token
}

export const verifyToken = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret)
        return decoded
    } catch (error) {
        throw new Error("Invalid token")
    }
}
export const isTokenValid = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret)
        return decoded
    } catch (error) {
        return false
    }
}


export const randomToken = (token) => {
    let auth = roles.map(role => isTokenValid(token, role) ? verifyToken(token, role) : null).filter(item => item !== null)[0]
    if (!auth) throw new Error("Invalid token")
    return auth
}