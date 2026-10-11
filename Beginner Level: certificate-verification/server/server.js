const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const { Blockchain } = require("./blockchain");

const app = express();
app.use(cors());
app.use(express.json());

const blockchain = new Blockchain();

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  course: { type: String, required: true },
  institution: { type: String, required: true },
  issueDate: { type: String, required: true },
  timestamp: { type: String, required: true },
  hash: { type: String, required: true },
  previousHash: { type: String, required: true },
  index: { type: Number, required: true },
});

const Certificate = mongoose.model("Certificate", certificateSchema);

function generateCertificateId() {
  return `CERT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

app.get("/", (req, res) => {
  res.json({ message: "Certificate Verification API is running" });
});

app.post("/api/certificates", async (req, res) => {
  try {
    const { studentName, course, institution, issueDate } = req.body;

    if (!studentName || !course || !institution || !issueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const certificateId = generateCertificateId();

    const data = { certificateId, studentName, course, institution, issueDate };

    const block = blockchain.addBlock(data);

    const certificate = new Certificate({
      ...data,
      timestamp: block.timestamp,
      hash: block.hash,
      previousHash: block.previousHash,
      index: block.index,
    });

    await certificate.save();

    res
      .status(201)
      .json({ message: "Certificate issued successfully", certificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/api/certificates/:certificateId", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId,
    });

    if (!certificate) {
      return res.status(404).json({
        verified: false,
        message: "Certificate not found",
      });
    }

    const isValid = blockchain.verifyBlock({
      index: certificate.index,
      timestamp: certificate.timestamp,
      data: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        course: certificate.course,
        institution: certificate.institution,
        issueDate: certificate.issueDate,
      },
      previousHash: certificate.previousHash,
      hash: certificate.hash,
    });

    res.json({ verified: isValid, certificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

startServer();
