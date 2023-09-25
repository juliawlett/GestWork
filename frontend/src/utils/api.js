//Arquivo para consumir a API
//axios - biblioteca para fazer solicitações GET, POST, PUT, DELETE
import axios from "axios"

// Exporta a instância configurada do Axios para uso em outros módulos
export default axios.create({
    baseURL: 'http://localhost:8000' // Define a URL base para todas as requisições - porta do BACKEND 
})