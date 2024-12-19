const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Claves VAPID (reemplaza con tus propias claves)
const vapidKeys = {
    publicKey: 'BEn1sa8BgFSgb37-tRj4HJMLN0dL-GmuG0gu2kX699I-PKRWlh6Q6Dsivvpg8VWdj0r1p_l8AZLNZFNOcCqfIl4',
    privateKey: 'Yu7-fe_3mCLAlLWz8V636vtTzLDdVJe6VQ636U21yWE'
};

webPush.setVapidDetails(
    'mailto:alotrendmarketing@gmail.com', // Reemplaza con tu correo
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Ruta para la raíz (para evitar el error "Cannot GET /")
app.get('/', (req, res) => {
    res.send('¡Hola, el servidor está en funcionamiento!');
});

// Ruta para suscripciones
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    // Aquí debes guardar las suscripciones en tu base de datos
    console.log('Nueva suscripción:', subscription);
    res.status(201).json({});
});

// Ruta para enviar notificaciones
app.post('/enviar-notificacion', (req, res) => {
    const subscription = req.body.subscription; // Suscripción del cliente
    const payload = JSON.stringify({
        title: 'Notificación',
        message: req.body.message, // Mensaje personalizado
        icon: '/icon.png'
    });

    webPush.sendNotification(subscription, payload)
        .then(() => res.status(200).json({}))
        .catch(err => console.error('Error al enviar notificación:', err));
});

// Inicia el servidor en el puerto configurado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
