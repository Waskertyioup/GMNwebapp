import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve HTML, CSS, JS

// === Nodemailer setup ===
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});







// === Endpoint to send mail ===
app.post("/send-mail", async (req, res) => {
  const { nombre, empresa, correo, telefono, pais, requerimiento, reunion } = req.body;

  try {
    await transporter.sendMail({
      from: `"GMN Website" <stardustvstream@gmail.com>`, // origin email
      to: `stardustvstream@gmail.com`, // destination email
      subject: "Nuevo mensaje desde el formulario de contacto",
      html: `
        <h3>Nuevo mensaje desde el sitio</h3>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Empresa:</b> ${empresa}</p>
        <p><b>Correo:</b> ${correo}</p>
        <p><b>Teléfono:</b> ${telefono || "No especificado"}</p>
        <p><b>País:</b> ${pais}</p>
        <p><b>Requerimiento:</b> ${requerimiento}</p>
        <p><b>Desea reunión:</b> ${reunion ? "Sí" : "No"}</p>
      `,
    });

    res.json({ ok: true, message: "Correo enviado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Error enviando correo" });
  }
});

// === Serve index.html on root ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === Start server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
