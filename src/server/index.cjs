require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const fs = require("fs");
const { RecaptchaEnterpriseServiceClient } = require("@google-cloud/recaptcha-enterprise");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

// Initialize reCAPTCHA Enterprise client
const recaptchaClient = new RecaptchaEnterpriseServiceClient();

async function verifyRecaptchaEnterprise(token, expectedAction) {
  const projectID = process.env.GOOGLE_PROJECT_ID;
  const siteKey = process.env.RECAPTCHA_SITE_KEY;
  const projectPath = recaptchaClient.projectPath(projectID);

  const [response] = await recaptchaClient.createAssessment({
    assessment: {
      event: {
        token,
        siteKey,
      },
    },
    parent: projectPath,
  });

  // Token validity
  if (!response.tokenProperties.valid) {
    console.log("Invalid token reason:", response.tokenProperties.invalidReason);
    return { success: false, score: 0 };
  }

  // Ensure action matches
  if (response.tokenProperties.action !== expectedAction) {
    console.log("Action mismatch:", response.tokenProperties.action);
    return { success: false, score: 0 };
  }

  const score = response.riskAnalysis.score;
  console.log("CAPTCHA score:", score);
  return { success: score >= 0.5, score };
}

app.post("/api/contact", upload.single("resume"), async (req, res) => {
  const { name, email, message, captcha } = req.body;
  const resume = req.file;

  // Step 1: Verify reCAPTCHA Enterprise
  try {
    const result = await verifyRecaptchaEnterprise(captcha, "submit");
    if (!result.success) {
      return res.status(400).json({ error: "Failed CAPTCHA verification", score: result.score });
    }
  } catch (err) {
    console.error("CAPTCHA verification error:", err);
    return res.status(500).json({ error: "CAPTCHA verification failed" });
  }

  // Step 2: Send email
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
        ? [{ filename: resume.originalname, path: resume.path }]
        : [],
    });

    // Delete uploaded file
    if (resume?.path) fs.unlinkSync(resume.path);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
