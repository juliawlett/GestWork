import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api'
import Input from '../../../components/Input'
import { toast } from 'react-toastify';
import Container from '../../../components/Container'
import Style from './EditDepart.module.css'
function EditDepart() {
    const { id } = useParams(); // Pega o ID da URL
    const [departamento, setDepartamento] = useState({})
    // const [infodepartamento, setInfodepartamento] = useState({})
    const [token] = useState(localStorage.getItem('token' || ''))
    const navigate = useNavigate()

    useEffect(() => {
        api.get(`/departamento/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setDepartamento(response.data);
        }).catch((error) => {
            console.error('Error fetching department:', error);
        });
    }, [navigate, id])

    // console.log(departamento.departamento.department)


    function handleChange(e) {
        setDepartamento({ ...departamento, [e.target.name]: e.target.value })
    }


    async function handleSubmit(e) {
        e.preventDefault();

        const dataToSend = { ...departamento };

        await api.patch(`/departamento/${id}`, dataToSend, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            toast.success(response.data.message); // Mostra a mensagem de sucesso
            navigate("/settings")
            return response.data;
        }).catch((err) => {
            toast.error(err.response.data.message);
            return err.response.data;
        })
    }



    return (
        <div>
            <Container>
                <div className={Style.fundo_container}>
                    <h1 className={Style.text_title}>Edite um departamento existente. </h1>


                    <hr></hr>

                    <form onSubmit={handleSubmit}>
                        {/* Nome do User */}

                        <Input
                            className='form-control rounded-pill'
                            type='text'
                            name='department' // O nome do campo é 'department'
                            label='Digite o novo nome do departamento'
                            handleChange={handleChange}
                            // value={departamento.department}

                        />
                        <button type='submit' className={`mt-4  w-100 ${Style.btn_criar}`} >EDITAR</button>
                    </form>
                </div>
            </Container>

        </div>

    )
}

export default EditDepart