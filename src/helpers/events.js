import { EventEmitter } from "events";
import { sendEmail } from "./nodemailer";

export const mailer = new EventEmitter()
const MailerMethods = [
    {
        name: "New User Added",
        func: (user) => sendEmail(user.email, user.password),
    },
    {
        name: "sammury",
        func: (data) => console.log("sendMail"),
    }
]
export const Logger = new EventEmitter()
const loggerMethods = [
    {
        name: "Make Log",
        func: ({ target, req }) => {
            req.to = target.name
            req.toId = target._id
        },
    }
]

//adding Mailer methods to the event
MailerMethods.forEach(({ name, func }) => mailer.on(`${name}`, func));
loggerMethods.forEach(({ name, func }) => Logger.on(`${name}`, func));
