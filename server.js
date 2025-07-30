const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-emails', async (req, res) => {
  const { contacts, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    for (const contact of contacts) {
      const personalized = message.replace(/{{Name}}/g, contact.Name || "Customer");
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: contact.Email,
        subject,
        text: personalized
      });
    }
    res.json({ status: "Emails sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send emails." });
  }
});

app.listen(3001, () => console.log("CRM Backend running on port 3001"));
