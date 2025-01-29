import { POST } from "../utils/methods";
export async function authApi(data) {
    return POST("/auth/cuenta/auth", data);
}

export async function registerApi(data) {
    return POST("/auth/persona", data);
}