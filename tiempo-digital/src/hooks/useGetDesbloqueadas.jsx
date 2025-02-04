import { getExternalID } from "../utils/auth";
import { GET } from "../utils/methods";

export default async function useGetDesbloqueadas() {
    const external_id = getExternalID();
    const response = await GET(`/qa/inquietud/desbloqueadas/${external_id}`);    
    console.log("response", response);
    
    return response.data;
}