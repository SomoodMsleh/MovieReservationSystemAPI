import nodemailer from "nodemailer";

export async function sendEmail(to,subject,html) {
    try{
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: `${process.env.APP_NAME} <${process.env.SENDER_EMAIL}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
        });
    }catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
