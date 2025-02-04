import { getExternalID } from "../utils/auth";
import { PUT } from "../utils/methods";

export default async function usePutModificarMonedas() {
    const external_id = getExternalID();
    return PUT(`/auth/persona/subCoins/${external_id}`);
}