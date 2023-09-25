import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import NavBar from '../components/Navbar'
import Container from "../components/Container"
import { Context } from '../context/UserContext'


// Usuario 
import Login from "../pages/User/Login"
import Register from "../pages/User/Register"
import Profile from "../pages/User/Profile"

//Configuração - departamento
import Settings from '../pages/Departamento/Settings'
import AddDepartamento from "../pages/Departamento/CreateDepart"
import EditDepart from '../pages/Departamento/EditDepart'

//Tarefas
import CreateTarefa from '../pages/Tarefas/CreateTarefa'
import MyTarefas from '../pages/Tarefas/MyTarefas'
import EditTarefa from '../pages/Tarefas/EditTarefa'

import Dashboard from '../pages/Dashboard'

import Teste from '../pages/PageTeste'

function Rotas() {
    const { authenticated } = useContext(Context)

    return (
        <>
            {authenticated ? <NavBar /> : null}
            <Routes>
                {authenticated ? (
                    <>
                        {/* User  */}
                            <Route exact path="/dashboard" element={<Dashboard />} />
                            <Route exact path="/user/profile" element={<Profile />} />
                            <Route exact path="/settings" element={<Settings />} />
                            <Route exact path="/settings/create" element={<AddDepartamento />} />
                            <Route exact path="/settings/edit/:id" element={<EditDepart />} />
                            {/* <Route exact path="/settings/edit/:id" element={<EditDepart />} /> */}
                            <Route exact path="/tarefa" element={<MyTarefas />} />
                            <Route exact path="/tarefa/create" element={<CreateTarefa />} />
                            <Route exact path="/tarefa/edit/:id" element={<EditTarefa />} />
                            <Route exact path="/testando" element={<Teste />} />

                    </>
                ) : (
                    <>
                        <Route exact path="/" element={<Login />} />
                        <Route exact path="/register" element={<Register />} />
                    </>
                )}
            </Routes>
        </>
    )
}

export default Rotas