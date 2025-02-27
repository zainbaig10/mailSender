import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Your SMTP host
  port: 465,
  secure: true,
  auth: {
    user: "support@sbpl-tc.com", // Your SMTP email
    pass: "Support@3251", // Replace with the actual password
  },
});

// API to Send Email
app.post("/sendEmail", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, message } = req.body;

    // Validation
    if (!firstName || !lastName || !phone || !email || !message) {
      return res.status(400).json({ msg: "❌ All fields are required" });
    }

    const mailOptions = {
      from: `"Customer Inquiry" <support@sbpl-tc.com>`, // Sender email
      to: "support@sbpl-tc.com", // Destination email
      subject: "New Customer Inquiry",
      text: `
        🔹 First Name: ${firstName}
        🔹 Last Name: ${lastName}
        🔹 Phone: ${phone}
        🔹 Email: ${email}
        
        📩 Message:
        ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ msg: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ msg: "❌ Error while sending email" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
