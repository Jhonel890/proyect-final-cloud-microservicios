import { useEffect, useState } from "react";
import { GET } from "../utils/methods";
import { getExternalID } from "../utils/auth";

//pregutnas respondidas pero bloqueadas
export default function useGetPreguntasRespondidas(refetchTrigger) {
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        const fetchPreguntas = async () => {
            try {
                const external_id = getExternalID();
                // const response = await GET(`/qa/inquietud/persona/${external_id}`);
                const response = await GET(`/qa/inquietud/respondidas`);
                console.log("useGetPreguntas", response);
                setPreguntas(response.data);
            } catch (error) {
                console.error("Error obteniendo preguntas:", error);
            }
        };
        fetchPreguntas();
    }, [refetchTrigger]);

    return preguntas;
}

export function useGetPreguntasRespondidasPorMi(refetchTrigger) {
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        const fetchPreguntas = async () => {
            try {
                const external_id = getExternalID();
                // const response = await GET(`/qa/inquietud/persona/${external_id}`);
                const response = await GET(`/qa/inquietud/respondidaPersona/${external_id}`);
                console.log("useGetPreguntas", response);
                setPreguntas(response.data);
            } catch (error) {
                console.error("Error obteniendo preguntas:", error);
            }
        };
        fetchPreguntas();
    }, [refetchTrigger]);

    return preguntas;
}

export function useGetPregunta(external_id) {
    const [pregunta, setPregunta] = useState(null); // Cambié el nombre a pregunta ya que es una sola
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchPregunta = async () => {
            setIsLoading(true);
            try {
                const response = await GET(`/qa/inquietud/${external_id}`);
                console.log(response.data);
                
                setPregunta(response.data);
            } catch (error) {
                console.error("Error obteniendo pregunta:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (external_id) {
            fetchPregunta();
        }
    }, [external_id]); // Agregamos el array de dependencias
    console.log(pregunta);
    
    return { pregunta, isLoading };
}