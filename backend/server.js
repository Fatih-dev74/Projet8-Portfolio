const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint pour gérer les envois d'e-mails
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  // Configurer le transporteur Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Ton adresse Gmail
      pass: process.env.EMAIL_PASS, // Ton mot de passe spécifique pour les applications
    },
  });

  // Définir les options de l'e-mail
  const mailOptions = {
    from: `"${name}" <${email}>`, // Montre le nom et l'email dans le champ "De"
    to: process.env.EMAIL_RECEIVER, // Ton e-mail
    subject: `Nouveau message de ${name}`, // Sujet de l'e-mail
    text: `
      Vous avez reçu un nouveau message :
  
      Nom : ${name}
      Email : ${email}
      Message :
      ${message}
  
      Vous pouvez répondre directement à cet email : ${email}.
    `,
    replyTo: email, // Configure "Répondre à" pour rediriger vers l'email de l'expéditeur
  };    

  // Envoyer l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de l'envoi du message." });
    }
    res.status(200).json({ message: "Message envoyé avec succès !" });
  });
});

// Démarrer le serveur
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
