import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";

const port = 4000;

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const companyToMail = {
  "EXION": "sales@ex-ion.com",
  TEST: "zain.baig98@gmail.com",
  GZONE: "gzone@uur.co.in",
};

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "sales@ex-ion.com",
    pass: "Exion@123",
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: "sales@ex-ion.com",
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

app.post("/sendEmail", async (req, res) => {
  try {
    const { name, email, phone, msg, company } = req.body;

    // Log the incoming data to check for issues
    console.log("Received Data:", req.body);

    // Check if all required fields are present
    if (!name || !email || !phone || !msg || !company) {
      return res.status(400).json({
        msg: "Missing required fields: name, email, phone, msg, company.",
      });
    }

    // Convert company to uppercase for case-insensitive matching
    const companyUpper = company.toUpperCase();

    if (!companyToMail[companyUpper]) {
      return res.status(400).json({
        msg: "Invalid company parameter: " + companyUpper,
      });
    }

    // Send the email
    await sendEmail(
      companyToMail[companyUpper],
      "You have a new Lead!!",
      `\n
        Name: ${name} \n
        Email: ${email} \n
        Phone: ${phone} \n
        Message: ${msg}
      `
    );

    return res.status(200).json({
      msg: "Mail sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error while sending mail",
    });
  }
});

app.listen(4000, () => {
  console.log(`Server is listening on port ${port}`);
});
