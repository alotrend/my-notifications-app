const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');

// Crear una instancia de Express
const app = express();

// Configurar body-parser para recibir solicitudes JSON
app.use(bodyParser.json());

// Las claves VAPID (estas deben ser únicas para tu proyecto)
const vapidKeys = {
    publicKey: 'BEn1sa8BgFSgb37-tRj4HJMLN0dL-GmuG0gu2kX699I-PKRWlh6Q6Dsivvpg8VWdj0r1p_l8AZLNZFNOcCqfIl4',  // Reemplaza con tu clave pública
    privateKey: 'Yu7-fe_3mCLAlLWz8V636vtTzLDdVJe6VQ636U21yWE' // Reemplaza con tu clave privada
};

// Configurar web-push con las claves VAPID
webPush.setVapidDetails(
    'mailto:alotrendmarketing@gmail.com',  // Tu correo electrónico de contacto
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Endpoint para recibir la solicitud y enviar la notificación
app.post('/enviar-notificacion', (req, res) => {
    const message = req.body.message;  // Obtén el mensaje del cuerpo de la solicitud

    // Aquí debes obtener las suscripciones de los usuarios desde tu base de datos
    const subscriptions = [
        {
            endpoint: 'https://fcm.googleapis.com/fcm/send/XXXXXXXXXXXXXXXXXXXXXXXXX',
            keys: {
                p256dh: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                auth: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
            }
        }
    ];

    // El payload de la notificación
    const payload = JSON.stringify({
        title: '¡Gran Descuento!',
        message: message,  // El mensaje que el administrador ingresó
        icon: '/icon.png'  // Ruta del icono de la notificación
    });

    // Enviar la notificación a todos los usuarios suscritos
    subscriptions.forEach(subscription => {
        webPush.sendNotification(subscription, payload)
            .then(response => {
                console.log('Notificación enviada:', response);
            })
            .catch(error => {
                console.error('Error al enviar la notificación:', error);
            });
    });

    res.send({status: 'Notificación enviada'});
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor de notificaciones corriendo en http://localhost:3000');
});
