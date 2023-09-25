// Importando as dependências necessárias do React e ReactDOM.
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importando o componente principal da aplicação.
import App from './App';

// Importando os estilos do Bootstrap e os estilos locais.
import 'bootstrap/dist/css/bootstrap.css';
import  './index.css'

// Criando uma raiz de renderização para o aplicativo, apontando para o elemento com ID 'root'.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizando o componente principal do aplicativo dentro de um modo de estrita observância.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

