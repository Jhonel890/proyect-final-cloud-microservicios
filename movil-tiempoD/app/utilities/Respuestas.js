import { API_URL } from "../constants/api";
import axios from "axios";

export const getRespuestas = async () => {
  try {
    const response = await axios.get(`${API_URL}/qa/respuesta/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las respuestas:", error);
    throw new Error("No se pudieron obtener las respuestas");
  }
};

export const getRespuesta = async (external_id) => {
  try {
    const response = await axios.get(`${API_URL}/qa/respuesta/${external_id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la respuesta:", error);
    throw new Error("No se pudo obtener la respuesta");
  }
};

export const postRespuesta = async (respuestaData) => { 
  try {    
    const response = await axios.post(`${API_URL}/qa/respuesta/`, respuestaData);
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error("Error al guardar la respuesta:", error);
    throw new Error("No se pudo guardar la respuesta");
  }
};

export const putRespuesta = async (external_id, respuestaData) => {
  try {
    const response = await axios.put(
      `${API_URL}/qa/respuesta/${external_id}`,
      respuestaData
    );
    return response.data;
  } catch (error) {
    console.error("Error al modificar la respuesta:", error);
    throw new Error("No se pudo modificar la respuesta");
  }
};

export const getMisRespuestas = async (persona_id) => {
  try {
    const response = await axios.get(
      `${API_URL}/qa/respuesta/misRespuestas/${persona_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener las respuestas del usuario:", error);
    throw new Error("No se pudieron obtener las respuestas del usuario");
  }
};
