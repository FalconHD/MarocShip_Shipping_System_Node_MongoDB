import nodemailer from "nodemailer";
import { renderView } from ".";
import { DriverModel, ManagerModel } from "../models";


const registrationTemplate = ({ email, password }) => {
    return (`
    <h1>Welcome to the system</h1>
    <p>Your email is: ${email}</p>
    <p>Your password is: ${password}</p>
    `)
}

const commandTemplate = ({ from, to, price }) => {
    return (`
    <h1>New Command</h1>
    <p>From: ${from}</p>
    <p>To: ${to}</p>
    <p>Price: ${price}</p>
    `)
}
export const sendEmail = async (info, template) => {

    const html = template ? await renderView(template, info) : null


    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });
    let result = await transporter.sendMail({
        from: 'Welcome <MarocShip@gmail.com>',
        to: info.email,
        subject: "MarocShip Support",
        html: html ? html : registrationTemplate(info),
    });

    console.log("Preview URL: %s", result);

}

export const sendEmailToDrivers = async ({ vehicle, command }) => {
    const drivers = await DriverModel.find({ car: vehicle });
    if (drivers.length > 0) {
        drivers.forEach(driver => {
            sendEmail({ email: driver.email, command, driver }, "reserveDeliveryTemplate")
        })
    }
}
export const sendEmailToManagers = async ({ drivers }) => {
    const managers = await ManagerModel.find();
    console.log(managers);
    managers.forEach(manager => {
        sendEmail({ email: manager.email, drivers }, "managerSummary")
    })

}
