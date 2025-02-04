import React, { useEffect, useState } from "react";
import { Alerta } from "../../utils/mensajes";
import useGetPreguntasResponder from "../../hooks/useGetPreguntasResponder";
import { postRespuestas } from "../../hooks/usePostRespuestas";
import { Link } from "react-router-dom";
import useGetMisCoins from "../../hooks/useGetMisCoins";
import useGetUser from "../../hooks/useGetUser";

const ResponderPreguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const preguntasData = useGetPreguntasResponder();
  const monedas = useGetMisCoins() || 0;
  const user = useGetUser() || {};

  useEffect(() => {
    setPreguntas(preguntasData);
  }, [preguntasData]);

  // const HandleResponder = async () => {
  //   if (!respuesta.trim()) {
  //     Alerta({ title: "Error", text: "Debes escribir una respuesta", icon: "error" });
  //     return;
  //   }

  //   const data = {
  //     external_id_pregunta: preguntaSeleccionada.external_id,
  //     respuesta,
  //   };

  //   const response = await postRespuestas(data);

  //   if (response.code === 200) {
  //     Alerta({ title: "Éxito", text: "Respuesta enviada correctamente", icon: "success" });
  //     setPreguntas(prev => prev.filter(p => p.external_id !== preguntaSeleccionada.external_id));
  //     setRespuesta("");
  //     setPreguntaSeleccionada(null);
  //   } else {
  //     Alerta({ title: "Error", text: "No se pudo enviar la respuesta", icon: "error" });
  //   }
  // };

  return (
    // <div className="responder-preguntas-container">
    //   <h2>Responder Preguntas</h2>
    //   <ul>
    //     {preguntas.map((pregunta) => (
    //       <li key={pregunta.external_id}>
    //         <h3>{pregunta.titulo}</h3>
    //         <p>{pregunta.descripcion}</p>
    //         <button onClick={() => setPreguntaSeleccionada(pregunta)}>Responder</button>
    //       </li>
    //     ))}
    //   </ul>
    //   {preguntaSeleccionada && (
    //     <div className="modal">
    //       <h3>Respondiendo: {preguntaSeleccionada.titulo}</h3>
    //       <textarea
    //         value={respuesta}
    //         onChange={(e) => setRespuesta(e.target.value)}
    //         placeholder="Escribe tu respuesta aquí..."
    //       ></textarea>
    //       <button onClick={HandleResponder}>Enviar Respuesta</button>
    //       <button onClick={() => setPreguntaSeleccionada(null)}>Cancelar</button>
    //     </div>
    //   )}
    // </div>
    <div style={styles.pageContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>TiempoDigital</div>
        <nav>
          <ul style={styles.navList}>
            <li style={{ ...styles.navItem, ...styles.navItemHover }}><Link to="/principal" style={{ textDecoration: 'none', color: 'inherit' }}>Desbloquear Preguntas</Link></li>
            <li style={{ ...styles.navItem, ...styles.navItemHover }}><Link to="/misSoluciones" style={{ textDecoration: 'none', color: 'inherit' }}>Soluciones a mis preguntas</Link></li>
            <li style={{ ...styles.navItem, ...styles.navItemHover }}><Link to="/misCoins" style={{ textDecoration: 'none', color: 'inherit' }}>Mis Coins</Link></li>
            <li style={{ ...styles.navItem, ...styles.navItemHover }}><Link to="/crearPregunta" style={{ textDecoration: 'none', color: 'inherit' }}>Crear Pregunta</Link></li>
            <li style={{ ...styles.navItem, ...styles.navItemHover }}><Link to="/perfil" style={{ textDecoration: 'none', color: 'inherit' }}>Perfil</Link></li>
          </ul>
        </nav>
      </aside>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <input
            type="text"
            placeholder="Buscar Preguntas"
            style={styles.input}
          />
          <div style={styles.profileContainer}>
            <span style={styles.notificationBadge}>{monedas}</span>
            <img
              src="https://img.freepik.com/vector-premium/dibujo-dibujos-animados-pila-monedas-oro-signo-dolar-el_761413-4292.jpg"
              alt="Monedas"
              style={{ width: "60px", height: "60px", borderRadius: "50%" }}
            />

            <span style={styles.profileName}><Link to="/perfil" style={{ textDecoration: 'none', color: 'inherit' }}>{user.nombres} {user.apellidos}</Link></span>
            <div style={styles.profileAvatar}>
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                alt="Avatar"
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
        <h2 style={styles.subTitle}>Preguntas para Responder</h2>
        {preguntas.length > 0 && (preguntas.map((pregunta, index) => (
          <>
            <div key={index} style={styles.card}>
              <div style={styles.cardContent}>
                <h2 style={styles.cardTitle}>{pregunta.titulo}</h2>
                <p style={styles.cardDescription}>{pregunta.descripcion}</p>
                <div style={styles.buttonContainer}>
                  <Link
                    to={`/masDetalles/${pregunta.external_id}`}
                    style={{
                      ...styles.outlineButton,
                      textDecoration: 'none',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    Más detalles
                  </Link>
                  <Link
                    to={`/responderPregunta/${pregunta.external_id}`}
                    style={{
                      ...styles.primaryButton,
                      textDecoration: 'none',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    Responder
                  </Link>
                </div>
              </div>
            </div>
          </>
        )))}
        {/* </div> */}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
  },
  sidebar: {
    width: "16rem",
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: "1rem",
    position: "fixed",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    borderBottom: "1px solid #4b5563",
    paddingBottom: "0.5rem",
  },
  navList: {
    marginTop: "1rem",
    listStyleType: "none",
    padding: 0,
  },
  navItem: {
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "0.375rem",
    marginBottom: "0.5rem",
    transition: "background-color 0.3s",
  },
  navItemHover: {
    ':hover': {
      backgroundColor: "#374151",
    },
  },
  mainContent: {
    marginLeft: "17rem",
    padding: "2rem 2rem 3rem",
    flex: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  input: {
    width: "100%",
    maxWidth: "20rem",
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  profileName: {
    fontSize: "1rem",
    fontWeight: "500",
  },
  profileAvatar: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    backgroundColor: "#d1d5db",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
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
    padding: "1.5rem",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
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
  notificationBadge: {
    marginLeft: '100px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '100%',
    padding: '2px 5px',
  },
  primaryButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "red",
    color: "white",
    cursor: "pointer",
    marginLeft: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
};

export default ResponderPreguntas;
