const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public")); // if we have static files

app.post("/generate-resume", (req, res) => {
  const data = req.body;

  // Create a PDF document
  const doc = new PDFDocument();
  // Set response headers for PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

  // Pipe the PDF to the response
  doc.pipe(res);

  // Add content to the PDF
  doc.fontSize(25).text("Resume", { align: "center" });

  // Personal Details
  doc.fontSize(18).text("Personal Details", { underline: true });
  doc
    .fontSize(12)
    .text(
      `Name: ${data.personalDetails.firstName} ${data.personalDetails.lastName}`
    );
  doc.text(`Email: ${data.personalDetails.email}`);
  doc.text(`Contact: ${data.personalDetails.contact}`);
  doc.text(`Address: ${data.personalDetails.address}`);
  doc.text(`City/State: ${data.personalDetails.cityState}`);
  doc.text(`Country: ${data.personalDetails.country}`);

  // Employment History
  doc.addPage();
  doc.fontSize(18).text("Employment History", { underline: true });
  data.employment.forEach((job, index) => {
    doc
      .fontSize(14)
      .text(`Job ${index + 1}: ${job.jobTitle} at ${job.employer}`);
    doc.fontSize(12).text(`From ${job.startDate} to ${job.endDate}`);
    doc.text(`City: ${job.city}`);
    doc.text(`Description: ${job.description}`);
    doc.moveDown();
  });

  // Education
  doc.addPage();
  doc.fontSize(18).text("Education", { underline: true });
  data.education.forEach((edu, index) => {
    doc
      .fontSize(14)
      .text(`Education ${index + 1}: ${edu.degree} from ${edu.institution}`);
    doc.fontSize(12).text(`Year: ${edu.year}`);
    doc.text(`City: ${edu.city}`);
    doc.text(`Description: ${edu.description}`);
    doc.moveDown();
  });

  // Skills
  doc.addPage();
  doc.fontSize(18).text("Skills", { underline: true });
  data.skills.forEach((skill) => {
    doc.fontSize(12).text(`${skill.skill}: ${skill.rating}/5`);
  });

  // Finalize the PDF
  doc.end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
