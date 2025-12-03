import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Import EmailJS for Node.js
import * as emailjs from '@emailjs/nodejs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware with increased payload limit
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increased from default 100KB to 10MB
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, "public")));

// EmailJS configuration
const emailjsConfig = {
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
  serviceId: process.env.EMAILJS_SERVICE_ID,
  contactTemplateId: process.env.EMAILJS_CONTACT_TEMPLATE_ID,
  joinTemplateId: process.env.EMAILJS_JOIN_TEMPLATE_ID
};

console.log('EmailJS Configuration Status:');
console.log('Public Key:', emailjsConfig.publicKey ? 'Set' : 'Missing');
console.log('Private Key:', emailjsConfig.privateKey ? 'Set' : 'Missing');
console.log('Service ID:', emailjsConfig.serviceId ? 'Set' : 'Missing');
console.log('Contact Template ID:', emailjsConfig.contactTemplateId ? 'Set' : 'Missing');
console.log('Join Template ID:', emailjsConfig.joinTemplateId ? 'Set' : 'Missing');

// Keep using multer for file uploads (better approach)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// === Contact Form Endpoint ===
app.post("/send-mail", async (req, res) => {
  console.log('Contact form endpoint called');
  console.log('Data received:', req.body);

  try {
    const { nombre, empresa, correo, telefono, pais, requerimiento, reunion } = req.body;

    // Validate required fields
    if (!nombre || !empresa || !correo || !pais || !requerimiento) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        ok: false, 
        message: "Missing required fields" 
      });
    }

    // Validate EmailJS config
    if (!emailjsConfig.publicKey || !emailjsConfig.privateKey || !emailjsConfig.serviceId || !emailjsConfig.contactTemplateId) {
      console.log('EmailJS configuration missing');
      return res.status(500).json({ 
        ok: false, 
        message: "Email server configuration incomplete" 
      });
    }

    console.log('All EmailJS config present');

    const templateParams = {
      nombre: nombre,
      empresa: empresa,
      correo: correo,
      telefono: telefono || "Not specified",
      pais: pais,
      requerimiento: requerimiento,
      reunion: reunion ? "Yes" : "No",
      date: new Date().toLocaleString('es-ES')
    };

    console.log('Sending contact form email via EmailJS...');
    
    // Send email via EmailJS
    const response = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.contactTemplateId,
      templateParams,
      {
        publicKey: emailjsConfig.publicKey,
        privateKey: emailjsConfig.privateKey
      }
    );

    console.log('Contact form email sent successfully!');
    
    res.json({ 
      ok: true, 
      message: "Email sent successfully"
    });

  } catch (err) {
    console.log('EmailJS Error:', err);
    
    let errorMessage = "Error sending email";
    if (err.status === 403) {
      errorMessage = "EmailJS authentication failed. Check your public and private keys.";
    }
    
    res.status(500).json({ 
      ok: false, 
      message: errorMessage
    });
  }
});

// === Join Form Endpoint (using FormData/multer - RECOMMENDED) ===
app.post("/send-join-mail", upload.single("resume"), async (req, res) => {
  console.log('Join form endpoint called');
  console.log('Data received:', req.body);
  console.log('File received:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');

  try {
    const { nombre, correo, pais, linkedin, area } = req.body;
    const file = req.file;

    // Validate required fields
    if (!nombre || !correo || !pais || !linkedin || !area) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        ok: false, 
        message: "Missing required fields" 
      });
    }

    // Validate file
    if (!file) {
      console.log('No file attached');
      return res.status(400).json({ 
        ok: false, 
        message: "Please attach your resume" 
      });
    }

    // Validate EmailJS config
    if (!emailjsConfig.publicKey || !emailjsConfig.privateKey || !emailjsConfig.serviceId || !emailjsConfig.joinTemplateId) {
      console.log('EmailJS configuration missing');
      return res.status(500).json({ 
        ok: false, 
        message: "Email server configuration incomplete" 
      });
    }

    const templateParams = {
      nombre: nombre,
      correo: correo,
      pais: pais,
      linkedin: linkedin,
      area: area,
      file_name: file.originalname,
      file_size: `${(file.size / 1024).toFixed(2)} KB`,
      date: new Date().toLocaleString('es-ES')
    };

    console.log('Sending join form email via EmailJS...');

    // Prepare options
    const options = {
      publicKey: emailjsConfig.publicKey,
      privateKey: emailjsConfig.privateKey
    };

    // Add attachment
    console.log('Converting file to base64 for EmailJS...');
    options.attachments = [{
      name: file.originalname,
      data: file.buffer.toString('base64'),
      type: file.mimetype || 'application/pdf'
    }];

    // Send email via EmailJS
    const response = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.joinTemplateId,
      templateParams,
      options
    );

    console.log('Join form email sent with attachment');
    
    res.json({ 
      ok: true, 
      message: "Application sent successfully"
    });

  } catch (err) {
    console.log('EmailJS Error (join form):', err);
    
    let errorMessage = "Error sending application";
    if (err.status === 403) {
      errorMessage = "EmailJS authentication failed. Check your keys.";
    } else if (err.message && err.message.includes('File too large')) {
      errorMessage = "File is too large (maximum 5MB)";
    }
    
    res.status(500).json({ 
      ok: false, 
      message: errorMessage
    });
  }
});

// === Health check endpoint ===
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "GMN Website API",
    emailjsConfigured: !!(emailjsConfig.publicKey && emailjsConfig.privateKey && emailjsConfig.serviceId),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware for payload too large
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    console.log('Payload too large error');
    return res.status(413).json({
      ok: false,
      message: "File is too large. Maximum size is 5MB."
    });
  }
  next(err);
});

// === Serve frontend files ===
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Payload limit: 10MB for JSON, 5MB for files`);
  console.log(`EmailJS configured: ${emailjsConfig.publicKey && emailjsConfig.privateKey ? 'Yes' : 'No'}`);
});