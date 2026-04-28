import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail", // Assuming gmail for user "learnbvm@gmail.com"
    auth: {
        user: process.env.email_id,
        pass: process.env.email_password,
    },
});

export const sendMeetingInviteEmail = async (toEmail, meetingName, meetingDate, meetingLink, ownerName) => {
    try {
        const mailOptions = {
            from: process.env.email_id,
            to: toEmail,
            subject: `Meeting Invitation: ${meetingName}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>You've been invited to a meeting!</h2>
                    <p><strong>Host:</strong> ${ownerName || "A user"}</p>
                    <p><strong>Meeting Name:</strong> ${meetingName}</p>
                    <p><strong>Date & Time:</strong> ${new Date(meetingDate).toLocaleString()}</p>
                    <br/>
                    <a href="${meetingLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Meeting</a>
                    <br/>
                    <p>Or copy this link to join: ${meetingLink}</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};
