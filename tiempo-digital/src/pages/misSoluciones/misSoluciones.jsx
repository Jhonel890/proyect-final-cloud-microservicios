import React from "react";
import { useNavigate } from "react-router-dom";
import useGetMisRespuestas from "../../hooks/useGetMisRespuestas";

const Soluciones = () => {
  const navigate = useNavigate();
  const soluciones = useGetMisRespuestas() || [];
  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.sectionTitle}>Soluciones a mis preguntas</h1>
        <button style={styles.backButton} onClick={() => navigate('/principal')}>
          Volver a Principal
        </button>
      </div>
      {/* mostrar en consola mi titulo de la pregunta*/}
      {console.log(soluciones)}


      {/* Soluciones Section */}
      <div style={styles.gridContainer}>
        {soluciones.map((solucion, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardContent}>
              <p style={styles.cardTitle}>{solucion.titulo}</p>
              <p style={styles.cardDescription}>{solucion.descripcion}</p>              {solucion.respuestas && solucion.respuestas.length > 0 && (
                <div>
                  <h4>Respuestas:</h4>
                  {solucion.respuestas.map((respuesta, index) => (
                    <p key={index} style={styles.cardResponse}>{respuesta.descripcion}</p>
                  ))}
                </div>
              )}              <div style={styles.buttonContainer}>
              </div>
            </div>
          </div>
        ))}
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
    ':hover': {
      backgroundColor: "#1e40af",
    },
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
  },
  card: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  cardContent: {
    padding: "1.5rem",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
  },
  cardDescription: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "1.25rem",
  },
  buttonContainer: {
    display: "flex",
    gap: "0.75rem",
  },
  outlineButton: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    backgroundColor: "white",
    color: "#1f2937",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ':hover': {
      backgroundColor: "#f3f4f6",
    },
  },
  primaryButton: {
    flex: 1,
    padding: "0.5rem",
    border: "none",
    borderRadius: "0.375rem",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ':hover': {
      backgroundColor: "#1e40af",
    },
  },
};

export default Soluciones;
