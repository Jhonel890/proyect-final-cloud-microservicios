import { useEffect, useState } from "react";
import { GET } from "../utils/methods";
import { getExternalID } from "../utils/auth";

export default function useGetMisPerfiles() {

    const [perfiles, setPerfiles] = useState([]);
    
    useEffect(() => {
        const fetchPerfiles = async () => {
            try {
                const external_id = getExternalID();
                const response = await GET(`/qa/perfil/misPerfiles/${external_id}`);
                console.log("useGetMisPerfiles", response.data);
                setPerfiles(response.data);
            } catch (error) {
                console.error("Error obteniendo perfiles:", error);
            }
        };
        fetchPerfiles();
    }, []);
    return perfiles;
}
