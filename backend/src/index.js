
import app from './server.js'
import http from 'http'
import { Server } from 'socket.io'


// Importar la función connection()
import connection from './database.js';

// Haicneod uso de la función connection()
connection()

// Crear el servidor
const server = http.createServer(app)
// Crear el servidor de socket
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173/",

    }
})

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('enviar-mensaje-fron-back', (payload) => {
        socket.broadcast.emit('enviar-mensaje-fron-back', payload)
        console.log(payload);
    })

});


server.listen(app.get("port"), () => {
    console.log(`Server y WebSockets corriendo en http://localhost:${app.get("port")}`);
});


