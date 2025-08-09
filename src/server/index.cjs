require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");

const app = express();

// ✅ Allow CORS for both local and Vercel
const allowedOrigins = [
  "http://localhost:3000",
  "https://digitalindian.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // Preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload setup
const upload = multer({ dest: "uploads/" });

// Contact API
app.post("/api/contact", upload.single("resume"), async (req, res) => {
  const { name, email, message, captcha } = req.body;
  const resume = req.file;

  try {
    // Step 1: Verify reCAPTCHA
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;
    const { data } = await axios.post(verifyURL, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captcha
      },
    });

    if (!data.success || data.score < 0.5) {
      return res.status(400).json({
        error: "Failed CAPTCHA verification",
        score: data.score
      });
    }

    // Step 2: Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "rw.68.work@gmail.com",
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      attachments: resume
        ? [{ filename: resume.originalname, path: resume.path }]
        : [],
    });

    // Delete uploaded file if exists
    if (resume?.path) fs.unlinkSync(resume.path);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Global error handler to still send CORS headers
app.use((err, req, res, next) => {
  console.error(err.stack);
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
