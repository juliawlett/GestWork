import Container from '../../../components/Container';
import Style from './Settings.module.css';
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Gear } from "react-bootstrap-icons";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Settings() {
    //Aqui vamos digitar a logica do perfil
    const [user, setUser] = useState({})
    const [departamento, setDepartamento] = useState([])
    const [token] = useState(localStorage.getItem('token') || '');

    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/')
        } else {
            api.get('/users/checkuser', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            }).then((response) => {
                setUser(response.data)
            })

            api.get('/departamento/mydepartamentos', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            }).then((response) => {
                setDepartamento(response.data.departamento);
            });
        }
    }, [token, navigate])


    async function removeDepartamento(id) {
        try {
            await api.delete(`/departamento/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            });
            const updateDepartamento = departamento.filter((departamento) => departamento.id !== id);
            setDepartamento(updateDepartamento);
            toast.success('Departamento deletado com sucesso')
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message)
        }
    }

    return (
        <div className={Style.tamanho_container_navbar_form}>
            <Container>
                <div className={Style.fundo_container}>
                    <div className={Style.fundo_menu}>
                        <div className={Style.div_menu}>
                            {/* <Gear className={Style.config} /> */}
                            <h3 className={Style.text_menu}>  CONFIGURAÇÃO</h3>
                        </div>
                    </div>

                    <hr></hr>

                    <div className={Style.border_tabela}>
                        <div className={Style.menu_departamento}>
                            <div className={Style.text_menu_departamento}>
                                <h2 className=''>DEPARTAMENTO</h2>
                            </div>
                            <button className={`${Style.botao_depart}`}>
                                <Link to="/settings/create" className={`${Style.text_depart}`}>Criar departamento</Link>
                            </button>

                        </div>

                        <div className={`mt-3 ${Style.fundo_depart}`}>


                            {departamento.length > 0 ? (
                                <table class="table table-white table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th className={Style.text_title}>Departamento</th>
                                            <th className={Style.text_title}>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departamento.map((departamento) => (
                                            <tr key={departamento.id}>
                                                <td className={`w-75 ${Style.text_departamento_tabela}`}>{departamento.department}</td>
                                                <td className={`d-flex ${Style.centralizar_btn}`}>
                                                    <div  className={Style.btn_editar}>
                                                        <Link className={Style.text_editar} to={`/settings/edit/${departamento.id}`}>
                                                            <FontAwesomeIcon icon={faEdit} /> Editar
                                                        </Link>
                                                    </div>

                                                    <button className={Style.deletar} onClick={() => { removeDepartamento(departamento.id) }}>
                                                        <FontAwesomeIcon icon={faTrashAlt} /> Remover
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className={`text-danger texto`}>Ainda não há departamentos!!</p>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Settings;
