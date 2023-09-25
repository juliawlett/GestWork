//resolver o login
//hook
import { useState, useEffect } from "react";
import api from '../utils/api'
import { useNavigate } from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function useAuth() {
  //verificar o estado atual do login
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    //verificar se existe token e encaminhar para a api
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      //mudar o estado do usuario para autenticado
      setAuthenticated(true)
    }
  }, [])

  //função para autenticar o usuario
  async function authUser(data) {
    setAuthenticated(true)
    localStorage.setItem('token', JSON.stringify(data.token))
    navigate('/')
  }

  //função para registrar um novo usuario
  async function register(user) {
    try {
      const data = await api.post('/users/register', user)
        .then((response) => {
          return response.data
        })
      toast.success(data.message)
      await authUser(data)
      navigate('dashboard')
    } catch (error) {
      console.log('Erro ao cadastrar ', error)
      alert(error.response.data.message)
    }
  }


  async function login(user) {
    try {
      const data = await api.post('/users/login', user)
        .then((response) => {
          return response.data
        })
      toast.success(data.message)
      await authUser(data)
      navigate('dashboard')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  async function logout() {
    setAuthenticated(false)
    localStorage.removeItem('token')
    api.defaults.headers.Authorization = undefined
    navigate('/')
    toast.success('Logout realizado com sucesso')
  }

  return { authenticated, register, login, logout }
}

export default useAuth