import { useEffect, useState } from "react";
import { getExternalID } from "../utils/auth";
import { GET } from "../utils/methods";

//preguntas para responder
export default function useGetPreguntasResponder(refetchTrigger) {
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        const fetchPreguntas = async () => {
            try {
                const external_id = getExternalID();
                const response = await GET(`/qa/inquietud/persona/${external_id}`);
                // const response = await GET(`/qa/inquietud/respondidas`);
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
