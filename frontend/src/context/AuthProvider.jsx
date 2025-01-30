import axios from "axios"
import { createContext, useEffect, useState } from "react"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    const perfil = async (token) => {
        try {
            // desestructuramos el token y obtenemos el rol
            const {rol} = JSON.parse(atob(token.split('.')[1]));
            const url = rol === 'veterinario' 
                ? 'http://localhost:3000/api/perfil' 
                : 'http://localhost:3000/api/paciente/perfil';
            
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.get(url, options);
            setAuth(respuesta.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            perfil(token);
        }
    }, []);

    const actualizarPerfil = async(datos) => {
        const token = localStorage.getItem('token')
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/veterinario/${datos.id}`
            const options = {
                headers: {
                    method: 'PUT',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }            
            const respuesta = await axios.put(url, datos, options)
            perfil(token)
            return {respuesta:respuesta.data.msg,tipo:true}
        } catch (error) {
            return {respuesta:error.response.data.msg,tipo:false}
        }
    }
    
    return (
        <AuthContext.Provider value={
            {
                auth,
                setAuth,
                actualizarPerfil
            }
        }>
            {children}
        </AuthContext.Provider>
    )

}
export {
    AuthProvider
}
export default AuthContext