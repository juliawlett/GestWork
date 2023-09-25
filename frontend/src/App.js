// Configuração das rotas 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useContext } from 'react'
import { Context, UserProvider } from "./context/UserContext";

//ToastContainer
import { ToastContainer } from "react-toastify"; // Importa o ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importa os estilos do ToastContainer
import Container from "./components/Container";

//Importando as Pages
import Rotas from "./Routes/Route"


function App() {
  return (
    <div className="App">
      <Router>
        <UserProvider>
          <Rotas />
        </UserProvider>
        <ToastContainer /> {/* Container para exibir notificações */}
      </Router>
    </div>
  );
}

export default App;

