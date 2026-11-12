const express = require('express');
const multer = require('multer');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configuration AWS SDK pour Floci
const awsConfig = {
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' }
};

const sqs = new SQSClient(awsConfig);
const s3 = new S3Client({ ...awsConfig, forcePathStyle: true });

app.post('/api/contact', upload.single('piece'), async (req, res) => {
  try {
    const { nom, email, message } = req.body;

    // 1. Envoi du message dans SQS
    await sqs.send(new SendMessageCommand({
      QueueUrl: 'http://localhost:4566/000000000000/notifications',
      MessageBody: JSON.stringify({ nom, email, message })
    }));

    // 2. Envoi de la pièce jointe dans S3 (si présente)
    if (req.file) {
      const fileContent = fs.readFileSync(req.file.path);
      await s3.send(new PutObjectCommand({
        Bucket: 'mini-cv-bucket',
        Key: `pieces/${req.file.originalname}`,
        Body: fileContent
      }));
      fs.unlinkSync(req.file.path); // Nettoyage
    }

    res.status(200).json({ status: 'OK', message: 'Contact et pièce jointe traités' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('API démarrée sur http://localhost:3000'));
