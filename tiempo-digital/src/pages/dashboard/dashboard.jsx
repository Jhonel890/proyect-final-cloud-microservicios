import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CompleteProfileModal from "../components/modalPerfil/modalPerfil";
import useProfileCompletion from "../../hooks/useProfileCompletion";
import "./styles.css";
import useGetPreguntas from "../../hooks/useGetPreguntas";
import useGetMisCoins from "../../hooks/useGetMisCoins";
import useGetUser from "../../hooks/useGetUser";
import { Alerta } from "../../utils/mensajes";
import usePutModificarMonedas from "../../hooks/usePutModificarMonedas";
import { getExternalID } from "../../utils/auth";
import usePostDesbloquearInquietud from "../../hooks/usePostDesbloquearInquietud";
import useGetDesbloqueadas from "../../hooks/useGetDesbloqueadas";

const Dashboard = () => {
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const preguntas = useGetPreguntas(refetchTrigger) || [];
  const { showModal, setShowModal, handleProfileSubmit } = useProfileCompletion(() => {
    setRefetchTrigger((prev) => !prev);
  });

  const monedas = useGetMisCoins() || 0;
  const user = useGetUser() || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const costoPregunta = 5;
  const [desbloqueadasHoy, setDesbloqueadasHoy] = useState([]);
  const [desbloqueadasAntes, setDesbloqueadasAntes] = useState([]);
  const [desbloqueadas, setDesbloqueadas] = useState([]);

  useEffect(() => {
    async function FetchDesbloqueadas() {
      const data = await useGetDesbloqueadas();
      setDesbloqueadas(data);
    }
    FetchDesbloqueadas();
    // console.log("desbloqueadas", desbloqueadas);
  }, []);

  useEffect((() => {
    if (desbloqueadas.length === 0) return;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const hoyArray = [];
    const antesArray = [];

    desbloqueadas.forEach((pregunta) => {
      const fechaPregunta = new Date(pregunta.updatedAt);
      fechaPregunta.setHours(0, 0, 0, 0);

      if (fechaPregunta.getTime() === hoy.getTime()) {
        hoyArray.push(pregunta);
      } else {
        antesArray.push(pregunta);
      }
    });

    setDesbloqueadasHoy(hoyArray);
    setDesbloqueadasAntes(antesArray);
  }), [preguntas, desbloqueadas]);

  const handleDesbloquearClick = (pregunta) => {
    setPreguntaSeleccionada(pregunta);
    setModalVisible(true);
  };

  const HandlePagar = async () => {
    const data = {
      external_id_pregunta: preguntaSeleccionada.external_id,
      external_id_persona: getExternalID(),
    };
    const response = await usePostDesbloquearInquietud(data);
    const responseMonedas = await usePutModificarMonedas();

    // console.log("response", response);
    // console.log("responseMonedas", responseMonedas);

    if (response.code !== 200) {
      Alerta({
        title: "Error",
        text: "Error al pagar la pregunta",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    if (responseMonedas.code !== 200) {
      Alerta({
        title: "Error",
        text: "Error al pagar la pregunta",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }

    if (response.code === 200 && responseMonedas.code === 200) {
      Alerta({
        title: "Exito",
        text: "Pregunta pagada con exito",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      setRefetchTrigger((prev) => !prev);
    } else {
      Alerta({
        title: "Error",
        text: "Error al pagar la pregunta",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }

    setModalVisible(false);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>TiempoDigital</div>
        <nav>
          <ul style={styles.navList}>
            <li style={{ ...styles.navItem, ...styles.navItemHover }}><Link to="/misSoluciones" style={{ textDecoration: 'none', color: 'inherit' }}>Soluciones a mis preguntas</Link></li>
            <li style={{ ...styles.navItem, ...styles.navItemHover }}><Link to="/misCoins" style={{ textDecoration: 'none', color: 'inherit' }}>Mis Coins</Link></li>
            <li style={{ ...styles.navItem, ...styles.navItemHover }}><Link to="/crearPregunta" style={{ textDecoration: 'none', color: 'inherit' }}>Crear Pregunta</Link></li>
            <li style={{ ...styles.navItem, ...styles.navItemHover }}><Link to="/perfil" style={{ textDecoration: 'none', color: 'inherit' }}>Perfil</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
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

        {/* Sección: Preguntas desbloqueadas hoy */}
        {desbloqueadasHoy.length > 0 && (
          <>
            <h2 style={styles.subTitle}>Desbloqueadas Hoy</h2>
            <div style={styles.gridContainer}>
              {desbloqueadasHoy.map((pregunta, index) => (
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Sección: Preguntas bloqueadas */}
        {preguntas.length > 0 && (
          <>
            <h2 style={styles.subTitle}>Preguntas Bloqueadas</h2>
            <div style={styles.gridContainer}>
              {preguntas
                .filter(
                  (pregunta) =>
                    !desbloqueadas.some(
                      (desbloqueada) => desbloqueada.external_id === pregunta.external_id
                    )
                )
                .map((pregunta, index) => (
                  <div key={index} style={styles.card}>
                    <div style={styles.cardContent}>
                      <h2 style={styles.cardTitle}>{pregunta.titulo}</h2>
                      <p style={styles.cardDescription}>{pregunta.descripcion}</p>
                      <button
                        onClick={() => handleDesbloquearClick(pregunta)}
                        style={styles.primaryButton}
                      >
                        Desbloquear
                      </button>
                    </div>
                  </div>
                ))}
              {/* {preguntas.map((pregunta, index) => (
                <div key={index} style={styles.card}>
                  <div style={styles.cardContent}>
                    <h2 style={styles.cardTitle}>{pregunta.titulo}</h2>
                    <p style={styles.cardDescription}>{pregunta.descripcion}</p>
                    <button
                      onClick={() => handleDesbloquearClick(pregunta)}
                      style={styles.primaryButton}
                    >
                      Desbloquear
                    </button>
                  </div>
                </div>
              ))} */}
            </div>
          </>
        )}

        {/* Sección: Preguntas desbloqueadas en días anteriores */}
        {desbloqueadasAntes.length > 0 && (
          <>
            <h2 style={styles.subTitle}>Desbloqueadas Anteriormente</h2>
            <div style={styles.gridContainer}>
              {desbloqueadasAntes.map((pregunta, index) => (
                <div key={index} style={styles.card}>
                  <div style={styles.cardContent}>
                    <h2 style={styles.cardTitle}>{pregunta.titulo}</h2>
                    <p style={styles.cardDescription}>{pregunta.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal de pago */}
        {modalVisible && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>Confirmar Pago</h2>
              <p>Monedas actuales: {monedas}</p>
              <p>Costo de la pregunta: {costoPregunta}</p>
              <p>Total restante: {monedas - costoPregunta}</p>

              {monedas >= costoPregunta ? (
                <button onClick={HandlePagar} style={styles.primaryButton}>
                  Pagar
                </button>
              ) : (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  No tienes suficientes monedas para desbloquear esta pregunta.
                </p>
              )}

              <button onClick={() => setModalVisible(false)} style={styles.cancelButton}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal de perfil */}
        {showModal && (
          <CompleteProfileModal
            onClose={() => setShowModal(false)}
            onSubmit={handleProfileSubmit}
          />
        )}
      </div>
    </div>
  );
};

// Estilos actualizados
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

export default Dashboard;
