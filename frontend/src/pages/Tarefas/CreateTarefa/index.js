import Container from '../../../components/Container'
import React, { useEffect, useState } from 'react'
import Input from '../../../components/Input'
import Select from '../../../components/Select'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from '../../../context/UserContext'
import api from '../../../utils/api'
import { toast } from 'react-toastify';
import Style from './CreateTarefa.module.css'
function CreateTarefa() {
    const [tarefa, setTarefa] = useState({})
    const { authenticated } = useContext(Context)
    const [token] = useState(localStorage.getItem('token') || '')
    const navigate = useNavigate()
    const [departamento, setDepartamento] = useState([])

    //Consta dos selects
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedPrioridade, setSelectedPrioridade] = useState('');

    //Opções do select para o Status
    const optionsStatus = [
        { value: '', label: '' },
        { value: 'fazer', label: 'A fazer' },
        { value: 'andamento', label: 'Em andamento' },
        { value: 'concluida', label: 'Concluida' },
        { value: 'cancelada', label: 'Cancelada' },
    ];
    const optionsPrioridade = [
        { value: '', label: '' },
        { value: 'normal', label: 'Normal' },
        { value: 'medio', label: 'Medio' },
        { value: 'urgente', label: 'Urgente' },
    ];

    //adicionando o evento para os selects
    const handleSelectChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
    };


    const handlePrioridadeChange = (e) => {
        setSelectedPrioridade(e.target.value);
    };

    useEffect(() => {
        // Realize uma chamada à API para buscar os valores de department do banco de dados
        api.get('/departamento/mydepartamentos')
            .then((response) => {
                // Atualize o estado com os valores obtidos da API
                setDepartamento(response.data.departamento);
                console.log(response.data)
            })
            .catch((err) => {
                console.error('Erro ao buscar valores de department:', err);
            });
    }, []); // O segundo argumento vazio [] garante que isso seja executado apenas uma vez após a montagem do componente.


    function handleChange(e) {
        setTarefa({ ...tarefa, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const dataToSend = {
            ...tarefa,
            status: selectedStatus, // Defina o campo "status" com o valor selecionado
            department: selectedDepartment,
            priority: selectedPrioridade

        };

        console.log(dataToSend); // Adicione este console.log

        const data = await api.post('/tarefa/create', dataToSend, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            navigate('/tarefa')
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



                    <h1>Criar uma nova tarefa</h1>
                    <hr></hr>
                    <form onSubmit={handleSubmit}>
                        <br></br>
                        <div className={Style.fundo_option}>
                            <div className={`w-100 ${Style.select_widht}`}>
                                <Input
                                    className={`form-control`}
                                    type='text'
                                    name='title'
                                    label='Titulo da tarefa:'
                                    handleChange={handleChange}
                                    placeholder='Ex: Comprar ração'
                                />
                            </div>
                            <div className={`ms-5 ${Style.select_widht}`}>
                                <Input
                                    className={` form-control`}
                                    type='date'
                                    name='predicted_end'
                                    label='Previsão de termino:'
                                    handleChange={handleChange}

                                />
                            </div>
                        </div>

                        <br></br>
                        <label className={`form-label`}>
                            Descrição da tarefa:
                        </label>
                        <textarea
                            className={`form-control ${Style.caixa_De_texto} ${Style.description - Input}`}
                            name='description'
                            label='Descrição da tarefa:'
                            onChange={handleChange}
                            placeholder='Ex: Comprar ração de 3KG para o gargamel'
                        ></textarea>

                        <br></br>

                        <div className={Style.fundo_option}>
                            <div className={` ${Style.select_widht}`}>
                                <Select
                                    className="form-select"
                                    label="Selecione uma opção"
                                    options={optionsStatus}
                                    name="status"
                                    value={selectedStatus}
                                    handleChange={handleSelectChange}
                                />
                            </div>
                            <div className={`ms-5 ${Style.select_widht}`}>
                                <Select
                                    className={`form-select`}
                                    label="Selecione uma prioridade"
                                    options={optionsPrioridade}
                                    name="priority"
                                    value={selectedPrioridade}
                                    handleChange={handlePrioridadeChange}
                                />
                            </div>

                        </div>

                        <br></br>
                        <label className={`form-label`}>
                            Selecione um departamento:
                        </label>
                        <select
                            name="department"
                            className="form-select"
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                        >
                            <option value=""></option>
                            {departamento.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.department}
                                </option>
                            ))}
                        </select>


                        <button type='submit' className={`mt-4  w-100 ${Style.btn_criar}`}>
                            CRIAR
                        </button>
                    </form>
                </div>
            </Container>
        </div>
    )
}

export default CreateTarefa
