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
    'mailto:alotrendmarketing@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.get('/', (req, res) => {
    res.send('¡Hola, el servidor está en funcionamiento!');
});

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    console.log('Nueva suscripción:', subscription);
    res.status(201).json({ message: 'Suscripción recibida correctamente.' });
});

app.post('/enviar-notificacion', (req, res) => {
    console.log('Datos recibidos:', req.body);

    if (!req.body.subscription || !req.body.message) {
        return res.status(400).json({ error: 'Datos faltantes para enviar la notificación.' });
    }

    const subscription = req.body.subscription;

    const decodedP256dh = Buffer.from(subscription.keys.p256dh, 'base64');
    const decodedAuth = Buffer.from(subscription.keys.auth, 'base64');

    if (decodedP256dh.length !== 65) {
        return res.status(400).json({ error: 'La longitud de p256dh no es válida.' });
    }

    const payload = JSON.stringify({
        title: 'Notificación',
        message: req.body.message,
        icon: '/icon.png'
    });

    webPush.sendNotification({
        endpoint: subscription.endpoint,
        keys: {
            p256dh: decodedP256dh.toString('base64'),
            auth: decodedAuth.toString('base64')
        }
    }, payload)
    .then(() => res.status(200).json({ message: 'Notificación enviada correctamente.' }))
    .catch(err => {
        console.error('Error al enviar notificación:', err);
        res.status(500).json({ error: 'Error al enviar la notificación.' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
