import nodemailer from "nodemailer";

export const sendEmail = async (email, password) => {

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

    let info = await transporter.sendMail({
        from: 'Welcome <MarocShip@gmail.com>',
        to: email,
        subject: "Welcome to MarocShip",
        text: " Test ",
        html: `<b>Email :  ${email}</br></b>
        <b> password : ${password}</b>`,
    });

    console.log("Preview URL: %s", info);


}