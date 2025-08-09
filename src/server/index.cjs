require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");

const app = express();

// ✅ Allow both localhost (for dev) and Vercel domain (for production)
const allowedOrigins = [
  "http://localhost:3000", // Local dev
  "https://digitalindian.vercel.app" // Your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

app.post("/api/contact", upload.single("resume"), async (req, res) => {
  const { name, email, message, captcha } = req.body;
  const resume = req.file;

  // ✅ Step 1: Verify reCAPTCHA token
  try {
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;
    const { data } = await axios.post(verifyURL, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captcha,
      },
    });

    if (!data.success || data.score < 0.5) {
      console.log("CAPTCHA score:", data.score);
      return res.status(400).json({ error: "Failed CAPTCHA verification", score: data.score });
    }
  } catch (err) {
    console.error("CAPTCHA verification error:", err);
    return res.status(500).json({ error: "CAPTCHA verification failed" });
  }

  // ✅ Step 2: Send Email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "rw.68.work@gmail.com",
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      attachments: resume
        ? [
            {
              filename: resume.originalname,
              path: resume.path,
            },
          ]
        : [],
    });

    if (resume?.path) fs.unlinkSync(resume.path);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
