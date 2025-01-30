import { useEffect, useState } from "react";
import io from 'socket.io-client';

const Chat = () => {
    const [mensaje, setMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]); // 🆕 Estado para almacenar mensajes
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            transports: ["websocket", "polling"]
        });
        setSocket(newSocket);

        // 🆕 Escuchar mensajes del servidor y agregarlos al estado
        newSocket.on('enviar-mensaje-fron-back', (payload) => {
            setMensajes(prevMensajes => [...prevMensajes, { text: payload, sender: "otro" }]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleMensajeChat = () => {
        if (socket && mensaje.trim() !== "") {
            socket.emit('enviar-mensaje-fron-back', mensaje);
            setMensajes(prevMensajes => [...prevMensajes, { text: mensaje, sender: "yo" }]); // 🆕 Agregar mensaje enviado
            setMensaje(""); // 🆕 Limpiar input
        }
    };

    return (
        <div className="flex flex-col justify-evenly h-screen">
            {/* Mensajes dinámicos */}
            <div className="flex flex-col space-y-4 p-3 overflow-y-auto">
                {mensajes.map((msg, index) => (
                    <div key={index} className={`chat-message flex items-end ${msg.sender === "yo" ? "justify-end" : ""}`}>
                        <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${msg.sender === "yo" ? "order-1 items-end" : "order-2 items-start"}`}>
                            <div>
                                <span className={`px-4 py-2 rounded-lg inline-block ${msg.sender === "yo" ? "rounded-br-none bg-gray-700 text-white" : "rounded-bl-none bg-gray-300 text-gray-600"}`}>
                                    {msg.text}
                                </span>
                            </div>
                        </div>
                        <img src={msg.sender === "yo" ? "https://cdn-icons-png.flaticon.com/512/2105/2105138.png" : "https://cdn-icons-png.flaticon.com/512/2934/2934749.png"}
                            alt="Profile" className="w-14 h-14 rounded-full order-2" />
                    </div>
                ))}
            </div>

            {/* Input de mensajes */}
            <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                <div className="relative flex">
                    <input type="text" placeholder="Escribe tu mensaje!" className="w-full text-gray-600 placeholder-gray-600 pl-2 bg-gray-200 rounded-md py-3"
                        value={mensaje} onChange={(e) => setMensaje(e.target.value)} />

                    <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                        <button type="button" className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-white bg-green-800 hover:bg-green-600"
                            onClick={handleMensajeChat}>
                            <span className="font-bold">Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
