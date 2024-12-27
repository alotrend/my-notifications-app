const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Claves VAPID (asegúrate de que sean las mismas que usas en WordPress)
const vapidKeys = {
    publicKey: 'BEn1sa8BgFSgb37-tRj4HJMLN0dL-GmuG0gu2kX699I-PKRWlh6Q6Dsivvpg8VWdj0r1p_l8AZLNZFNOcCqfIl4',
    privateKey: 'Yu7-fe_3mCLAlLWz8V636vtTzLDdVJe6VQ636U21yWE'
};

webPush.setVapidDetails(
    'mailto:alotrendmarketing@gmail.com', // Reemplaza con tu correo
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Ruta raíz para verificar que el servidor está corriendo
app.get('/', (req, res) => {
    res.send('Servidor de notificaciones funcionando correctamente.');
});

// Ruta para guardar suscripciones
app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Suscripción inválida.' });
    }

    console.log('Nueva suscripción recibida:', subscription);

    // Aquí puedes guardar la suscripción en tu base de datos si es necesario
    res.status(201).json({ message: 'Suscripción guardada correctamente.' });
});

// Ruta para enviar notificaciones
app.post('/enviar-notificacion', (req, res) => {
    const { subscription, title, message } = req.body;

    if (!subscription || !title || !message) {
        return res.status(400).json({ error: 'Datos faltantes para enviar la notificación.' });
    }

    const payload = JSON.stringify({
        title,
        message,
        icon: '/icon.png',
        click_action: 'https://alotrendmarketing.com/tienda2/' // URL a redirigir
    });

    webPush.sendNotification(subscription, payload)
        .then(() => res.status(200).json({ message: 'Notificación enviada correctamente.' }))
        .catch(err => {
            console.error('Error al enviar notificación:', err);
            res.status(500).json({ error: 'Error al enviar la notificación.' });
        });
});

// Iniciar el servidor en el puerto configurado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
