import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

// SMTP Configuration (Replace with your actual SMTP details)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Your SMTP host
  port: 465,
  secure: true,
  auth: {
    user: "sales@ex-ion.com", // Your SMTP email
    pass: "Exion@123", // Your SMTP password
  },
});

// API to Send Email
app.post("/sendEmail", async (req, res) => {
  try {
    const { userEmail, userMessage } = req.body;

    // Basic validation
    if (!userEmail || !userMessage) {
      return res.status(400).json({ msg: "❌ Email and message are required" });
    }

    const mailOptions = {
      from: `"Customer Inquiry" <sales@ex-ion.com>`, // Fixed sender
      to: "support@sbpl-tc.com", // Destination email
      subject: "New Customer Inquiry",
      text: `Customer Email: ${userEmail}\n\nMessage: ${userMessage}`, // User email is included in the body
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ msg: "✅ Email sent successfully" });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ msg: "❌ Error while sending email" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});