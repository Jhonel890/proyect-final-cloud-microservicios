import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import Login from './pages/login/login';
import NotFound from './pages/notfound';
import Register from './pages/register/register';
import MisSoluciones from './pages/misSoluciones/misSoluciones';
import MisCoins from './pages/misCoins/misCoins';
import CrearPregunta from './pages/crearPregunta/crearPregunta';
import Perfil from './pages/perfil/perfil';
import ResponderPreguntas from './pages/responderPreguntas/responderPreguntas';
import ResponderPregunta from './pages/responderPregunta/[external_id]/responderPregunta';
import MasDetalles from './pages/masDetalles/[external_id]/masDetalles';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/principal" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/misSoluciones" element={< MisSoluciones/>} />
        <Route path="/misCoins" element={< MisCoins/>} />
        <Route path="/crearPregunta" element={< CrearPregunta/>} />
        <Route path="/perfil" element={< Perfil/>} />
        <Route path="/responderPreguntas" element={< ResponderPreguntas/>} />
        <Route path="/responderPregunta/:external_id" element={< ResponderPregunta/>} />
        <Route path="/masDetalles/:external_id" element={< MasDetalles/>} />



      </Routes>
    </Router>
  );
};

export default App;
