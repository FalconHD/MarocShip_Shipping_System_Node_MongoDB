import { EventEmitter } from "events";
import { bonusCalculator } from ".";
import { ManagerModel } from "../models";
import { sendEmail, sendEmailToDrivers, sendEmailToManagers } from "./nodemailer";

export const mailer = new EventEmitter()
const MailerMethods = [
    {
        name: "New User Added",
        func: (user, template = null) => sendEmail(user, template),
    },
    {
        name: "manager summary",
        func: (data) => sendEmail(data, "managerSummary"),
    },
    {
        name: "New Command Added",
        func: (data) => sendEmailToDrivers(data),
    }
]
export const Logger = new EventEmitter()
const loggerMethods = [
    {
        name: "Make Log",
        func: ({ target, req }) => {
            req.to = target?.name
            req.toId = target?._id
        },
    }
]
export const Bonus = new EventEmitter()
const BonusMethods = [
    {
        name: "new Mouth Record",
        func: async () => {
            let drivers = await bonusCalculator()
            await sendEmailToManagers({ drivers })
        }
    }
]


//adding Mailer methods to the event
MailerMethods.forEach(({ name, func }) => mailer.on(`${name}`, func));
loggerMethods.forEach(({ name, func }) => Logger.on(`${name}`, func));
BonusMethods.forEach(({ name, func }) => Bonus.on(`${name}`, func));
