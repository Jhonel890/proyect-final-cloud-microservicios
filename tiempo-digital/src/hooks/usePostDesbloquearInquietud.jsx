import { POST } from "../utils/methods";

export default async function usePostDesbloquearInquietud(data) {
    return POST(`/qa/inquietud/desbloquear`, data);
}