import { getExternalID } from "../utils/auth";
import { GET } from "../utils/methods";

export default async function useGetDesbloqueadas() {
    const external_id = getExternalID();
    const response = await GET(`/qa/inquietud/desbloqueadas/${external_id}`);    
    return response.data;
}