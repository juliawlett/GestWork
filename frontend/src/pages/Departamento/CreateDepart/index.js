import Container from '../../../components/Container'
import React from 'react'
import Input from '../../../components/Input'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { Context } from '../../../context/UserContext'
import api from '../../../utils/api'
import { toast } from 'react-toastify';
import Style from './CreateDepart.module.css'

function CreateDepart() {
    const [departamento, setDepartamento] = useState({})
    const { authenticated } = useContext(Context)
    const [token] = useState(localStorage.getItem('token') || '')
    const navigate = useNavigate()


    function handleChange(e) {
        setDepartamento({ ...departamento, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const dataToSend = { ...departamento };

        const data = await api.post('/departamento/create', dataToSend, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            navigate('/settings')
            toast.success(response.data.message)
            return response.data
        }).catch((err) => {
            toast.error(err.response.data.message)
            return err.response.data
        })
    }

    return (
        <div>
            <Container>
                <div className={Style.fundo_container}>
                    <h1 className={Style.text_title}>Crie um novo departamento. </h1>

                    <hr></hr>
                    <form onSubmit={handleSubmit}>
                        {/* Nome do User */}
                        <Input
                            className={`form-control rounded-pill ${Style.label}`}
                            type='text'
                            label='Digite o nome do novo departamento:'
                            placeholder='Ex: Financeiro'
                            name='department' // Aqui o nome do campo é 'department'
                            handleChange={handleChange}
                        />


                        <button type='submit' className={`mt-5  w-100 ${Style.btn_criar}`} >CRIAR</button>
                    </form>
                </div>
            </Container>
        </div>

    )
}

export default CreateDepart