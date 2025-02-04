import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET } from "../../../utils/methods";
import { useGetPregunta } from "../../../hooks/useGetPreguntas";

const MasDetalles = () => {
  const { external_id } = useParams();
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState([]);
  const { pregunta, isLoading, error } = useGetPregunta(external_id);

  useEffect(() => {    
    if (pregunta) {      
      setRespuestas(pregunta.respuestas);
    }
  }, [pregunta]);

  // useEffect(() => {
  //   const FetchPregunta = async () => {
  //     const { data } = useGetPregunta(id);
  //     try {
  //       console.log(data);

  //       setPregunta(data.pregunta);
  //       setRespuestas(data.respuestas);
  //     } catch (err) {
  //       setError("Error al cargar la pregunta o no existe.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   FetchPregunta();
  // }, [id]);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.sectionTitle}>Más Detalles</h1>
        <button style={styles.backButton} onClick={() => navigate('/principal')}>
          Volver a Principal
        </button>
      </div>

      {/* Pregunta */}
      <div style={styles.questionContainer}>
        <h2 style={styles.questionTitle}>{pregunta.titulo}</h2>
        <p style={styles.questionDescription}>{pregunta.descripcion}</p>
      </div>

      {/* {pregunta ? (
        <div style={styles.questionContainer}>
          <h2 style={styles.questionTitle}>{pregunta.titulo}</h2>
          <p style={styles.questionDescription}>{pregunta.descripcion}</p>
        </div>
      ) : (
        <p>Cargando pregunta...</p>
      )} */}

      {/* Respuestas */}
      <div style={styles.responsesContainer}>
        <h3 style={styles.sectionTitle}>Respuestas</h3>
        {respuestas.length > 0 ? (
          <ul style={styles.responsesList}>
            {respuestas.map((respuesta) => (
              <li key={respuesta.id} style={styles.responseItem}>
                <p>{respuesta.descripcion}</p>
                {/* <small>Por: {respuesta.autor}</small> */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay respuestas aún.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    padding: "2rem",
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  backButton: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "0.375rem",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  questionContainer: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    marginBottom: "2rem",
  },
  questionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  questionDescription: {
    fontSize: "1rem",
    color: "#6b7280",
    marginTop: "1rem",
  },
  responsesContainer: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  responsesList: {
    listStyle: "none",
    padding: 0,
  },
  responseItem: {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
  },
};

export default MasDetalles;