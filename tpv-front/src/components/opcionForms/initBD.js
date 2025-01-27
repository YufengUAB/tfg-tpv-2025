import React from 'react';
import { toast } from 'react-toastify'; // Asegúrate de tener react-toastify instalado
import { initBD } from '../../services/initBDService'; // Aquí importamos la función que hará la petición a la API

const InitBDButton = () => {
    const handlerInit = async () => {
        try {
            // Llamada a la API para inicializar la base de datos
            const response = await initBD();
            toast.success('Base de datos inicializada con éxito');
        } catch (error) {
            console.error('Error al inicializar la base de datos:', error);
            toast.error('Error al inicializar la base de datos');
        }
    };

    return (
        <div className="init-bd-container">
            <h2>Inicializar Base de Datos</h2>
            <button
                className="init-db-button"
                onClick={handlerInit} // Llama a la función que hace la petición
            >   
                Inicializar Base de Datos
            </button>
        </div>
    );
};

export default InitBDButton;
