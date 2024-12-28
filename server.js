const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Claves VAPID
const vapidKeys = {
    publicKey: 'BEn1sa8BgFSgb37-tRj4HJMLN0dL-GmuG0gu2kX699I-PKRWlh6Q6Dsivvpg8VWdj0r1p_l8AZLNZFNOcCqfIl4',
    privateKey: 'Yu7-fe_3mCLAlLWz8V636vtTzLDdVJe6VQ636U21yWE'
};

webPush.setVapidDetails(
    'mailto:alotrendmarketing@gmail.com', // Tu email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Ruta raíz para pruebas
app.get('/', (req, res) => {
    res.send('Servidor de notificaciones en tiempo real funcionando.');
});

// Ruta para enviar notificación
app.post('/enviar-notificacion', (req, res) => {
    const { subscription, message } = req.body;

    if (!subscription || !message) {
        return res.status(400).json({ error: 'Datos faltantes para enviar la notificación.' });
    }

    // Crea el payload de la notificación
    const payload = JSON.stringify({
        title: 'Notificación',
        message: message,
        icon: '/icon.png'
    });

    webPush.sendNotification(subscription, payload)
        .then(() => {
            res.status(200).json({ success: 'Notificación enviada con éxito.' });
        })
        .catch(err => {
            console.error('Error al enviar la notificación:', err);
            res.status(500).json({ error: 'Error al enviar la notificación.' });
        });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
