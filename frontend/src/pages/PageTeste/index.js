import React, { useState, useEffect } from 'react';
import api from '../../utils/api'
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Container from "../../components/Container"


const Testando = () => {


    const [user, setUser] = useState({})
    const [token] = useState(localStorage.getItem('token') || '');
    const navigate = useNavigate()

    const [taskStats, setTaskStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        toDoTasks: 0,
        canceledTasks: 0,
    });


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

            api.get('/tarefa/mytarefa', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            }).then((response) => {
                const tarefaArray = response.data.tarefa; // Acesse o array dentro de 'tarefa'

                const TotalTarefa = tarefaArray.length;
                const FazerTarefa = tarefaArray.filter((tarefa) => tarefa.status === 'fazer').length;
                const AndamentoTarefa = tarefaArray.filter((tarefa) => tarefa.status === 'andamento').length;
                const ConcluidaTarefa = tarefaArray.filter((tarefa) => tarefa.status === 'concluida').length;
                const CanceladaTarefa = tarefaArray.filter((tarefa) => tarefa.status === 'cancelada').length;

                setTaskStats({
                    TotalTarefa,
                    ConcluidaTarefa,
                    AndamentoTarefa,
                    FazerTarefa,
                    CanceladaTarefa,
                });
            })
                .catch((error) => {
                    console.log('Erro ao buscar tarefa:', error)
                })
        }
    }, [token, navigate])

    // Função para calcular as porcentagens
    const calcularPorcentagem = (valor) => {
        return ((valor / taskStats.TotalTarefa) * 100).toFixed(2); // Arredonde para 2 casas decimais
    };
    const dadosGraficoPizza = [
        { status: 'A fazer', porcentagem: parseFloat(calcularPorcentagem(taskStats.FazerTarefa)) },
        { status: 'Andamento', porcentagem: parseFloat(calcularPorcentagem(taskStats.AndamentoTarefa)) },
        { status: 'Concluida', porcentagem: parseFloat(calcularPorcentagem(taskStats.ConcluidaTarefa)) },
        { status: 'Cancelada', porcentagem: parseFloat(calcularPorcentagem(taskStats.CanceladaTarefa)) },
      ];

    console.log(dadosGraficoPizza)

    const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];



    return (
        <Container>

            <div className="d-flex flex-column p-3 w-100" style={{ backgroundColor: 'white', maxHeight: '100vh', overflow: 'auto' }}>
                <h2>Painel de Controle</h2>
                <div className="d-flex flex-wrap justify-content-between mb-4 ">
                    <div style={{ width: '48%' }}>
                        <h4>Gráfico de Pizza - Distribuição de Alunos por Matéria</h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={dadosGraficoPizza}
                                    dataKey="porcentagem"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    fill="#8884d8"
                                    label={({ status, porcentagem }) => `${status} ${(porcentagem)}%`}
                                >
                                    {dadosGraficoPizza.map((entrada, indice) => (
                                        <Cell key={`cell-${indice}`} fill={CORES[indice % CORES.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </Container>

    );
};

export default Testando;
