import mongosse from "mongoose";


const { PORT, MONGO_USER, MONGO_PASS, MONGO_NAME } = process.env
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@marocship.lula5.mongodb.net/${MONGO_NAME}?retryWrites=true&w=majority`

export const connection = (cb) => mongosse.connect(MONGO_URI).then(() => {
    console.log("Connected to DB");
    cb()
}).catch(err => {
    console.log(err.message)
    cb()
})
