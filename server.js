const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { PDFDocument } = require("pdf-lib");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Serve frontend

// Route to generate PDF
app.post("/generate-pdf", async (req, res) => {
  try {
    // Load existing PDF
    const existingPdfBytes = fs.readFileSync(
      "ACORD-Automobile-Loss-Notice-12.05.16.pdf"
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Fill fields (example fields)
    form.getTextField("NAME OF INSURED First Middle Last")
        .setText(req.body.name);

    form.getTextField("DATE OF BIRTH")
        .setText(req.body.dob);

    form.getTextField("POLICY NUMBER")
        .setText(req.body.policyNumber);

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating PDF");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});