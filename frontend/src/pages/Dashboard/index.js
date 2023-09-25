import React, { useState, useEffect } from 'react';
import api from '../../utils/api'
import { Link, useNavigate } from 'react-router-dom';
import Container from "../../components/Container"
import Style from './Dashboard.module.css'
import { Trello, PlusSquareFill, ChevronUp, ChevronDown, ArrowDownSquare } from 'react-bootstrap-icons'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Collapse } from 'react-bootstrap';



function Dashboard() {

  const [user, setUser] = useState({})
  const [departamento, setDepartamento] = useState([])
  const [token] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate()



  const [isOpen, setIsOpen] = useState(true); // Defina o estado inicial como true para começar aberto
  const [lastFiveTasks, setLastFiveTasks] = useState([]); // Estado para armazenar as últimas cinco tarefas

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
        console.log(response.data); // Adicione esta linha
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

        const lastFive = tarefaArray.slice(-3); // Pega as últimas cinco tarefas
        setLastFiveTasks(lastFive);

      })
        .catch((error) => {
          console.log('Erro ao buscar tarefa:', error)
        })
    }
    api.get('/departamento/mydepartamentos', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    }).then((response) => {
      setDepartamento(response.data.departamento);
    });
  }, [token, navigate])

  function getDepartmentName(departmentID) {
    const department = departamento.find((dept) => dept.id === departmentID);
    return department ? department.department : '';
  }

  // Função para calcular as porcentagens
  const calcularPorcentagem = (valor) => {
    return ((valor / taskStats.TotalTarefa) * 100).toFixed(2); // Arredonde para 2 casas decimais
  };
  const dadosGraficoPizza = [
    { status: 'A fazer: ', porcentagem: parseFloat(calcularPorcentagem(taskStats.FazerTarefa)) },
    { status: 'Andamento: ', porcentagem: parseFloat(calcularPorcentagem(taskStats.AndamentoTarefa)) },
    { status: 'Concluida: ', porcentagem: parseFloat(calcularPorcentagem(taskStats.ConcluidaTarefa)) },
    { status: 'Cancelada: ', porcentagem: parseFloat(calcularPorcentagem(taskStats.CanceladaTarefa)) },
  ];

  console.log(dadosGraficoPizza)

  const CORES = ['#FF0000', '#CCCC00', '#00CC00', '#646464'];

  return (
    <div>
      <Container>
        <div className={Style.container}>
          <div className={Style.formatacao_titulo}>
            <Trello className={Style.trello} />
            <h3 className={Style.titulo_font}>Painel de Controle - {user.name}</h3>
          </div>

          <div className={Style.menu_quantidade}>
            <div className={Style.menu_fazer}>
              <p className={Style.text_p}>
                Tarefas a Fazer:
              </p>
              <h3 className={Style.numero_tarefa}> {taskStats.FazerTarefa}</h3>
            </div>
            <div className={Style.menu_andamento}>
              <p className={Style.text_p}>
                Tarefas em Andamento:
              </p>
              <h3 className={Style.numero_tarefa}>{taskStats.AndamentoTarefa}</h3>
            </div>
            <div className={Style.menu_concluida}>
              <p className={Style.text_p}>
                Tarefas Concluídas:
              </p>
              <h3 className={Style.numero_tarefa}> {taskStats.ConcluidaTarefa}</h3>
            </div>
            <div className={Style.menu_cancelada}>
              <p className={Style.text_p}>
                Tarefas Canceladas:
              </p>
              <h3 className={Style.numero_tarefa}> {taskStats.CanceladaTarefa}</h3>
            </div>
            <div className={Style.menu_total}>
              <p className={Style.text_p}>
                Total de Tarefas:
              </p>
              <h3 className={Style.numero_tarefa}>{taskStats.TotalTarefa}</h3>
            </div>
            <div className={Style.linha}></div>
            <Link className={Style.menu_criar} to="/tarefa/create">
              <PlusSquareFill className={Style.plus} />
              <p className={Style.text_criar}>Criar tarefa</p>
            </Link>


          </div>

          <div className={Style.fundo}>
            <div className={Style.fundo_grafico}>
              <p className={Style.text_grafico}>Gráfico de Pizza - Tarefas em % </p>

              <ResponsiveContainer width="100%" className={Style.fundo_comp_grafico} height={300}>
                <PieChart>
                  <Pie

                    data={dadosGraficoPizza}
                    dataKey="porcentagem"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label={({ status, porcentagem }) => `${status} ${(porcentagem)}%`}
                    animationBegin={0}
                    animationDuration={1000} // Ajuste a duração da animação conforme necessário
                    animationEasing="ease-in"
                  >
                    {dadosGraficoPizza.map((entrada, indice) => (
                      <Cell key={`cell-${indice}`} fill={CORES[indice % CORES.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={Style.fundo_departamento}>
              {departamento.length > 0 ? (
                <table class={`${Style.tabela} `}>
                  <thead className={Style.fundo_name_color}>
                    <tr className='' >
                      <th className={`p-2 w-75 text-white fw-medium`}>Departamento(s)</th>
                      <th className={`p-2 fw-medium text-white ${Style.border_criado}`}>

                        Criado em:

                        <ArrowDownSquare className={Style.btn_ver} onClick={() => setIsOpen(!isOpen)}
                          aria-expanded={isOpen}
                          aria-controls="departamentoCollapse" />

                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    {departamento.map((departamento, index) => (
                      <Collapse in={isOpen}>
                        <tr key={departamento.id}>
                          <td className={`w-75 p-2 ${Style.text_departamento_tabela}`} id="departamentoCollapse">
                            {departamento.department}
                          </td>
                          <td className={`w-75 p-2 ${Style.text_departamento_tabela}`} id="departamentoCollapse">
                            {format(new Date(departamento.createdAt), 'dd/MM/yyyy')}
                          </td>
                        </tr>
                      </Collapse>

                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={`text-danger texto`}>Ainda não há departamentos!!</p>
              )}
            </div>
          </div>

          <div className={Style.fundo_tarefa}>
            <p className={Style.text_tarefa}>Tres ultimas tarefas criadas:</p>
            <table className={`${Style.tabela} `}>
              <thead className={Style.fundo_name_color}>
                <tr>
                  <th className={`p-2 text-white fw-medium`}>ID Card</th>
                  <th className={`p-2 text-white fw-medium`}>Titulo da tarefa</th>
                  <th className={`p-2 text-white fw-medium`}>Status</th>
                  <th className={`p-2 text-white fw-medium`}>Prioridade</th>
                  <th className={`p-2 text-white fw-medium`}>Departamento</th>
                  <th className={`p-2 text-white fw-medium `}>Previsão de termino</th>
                  <th className={`p-2 text-black fw-medium bg-body-tertiary`}></th>
                </tr>
              </thead>
              <tbody>
                {lastFiveTasks.map((tarefa, index) => (
                  <tr key={tarefa.id}>
                    <td className={` p-2 ${Style.text_departamento_tabela}`}>
                      #{tarefa.id_card}
                    </td>
                    <td className={`p-2 ${Style.text_departamento_tabela}`}>
                      {tarefa.title}
                    </td>
                    <td className={`p-2 ${Style.text_departamento_tabela}`}>
                      {tarefa.status}
                    </td>
                    <td className={`p-2 ${Style.text_departamento_tabela}`}>
                      {tarefa.priority}
                    </td>
                    <td className={`p-2 ${Style.text_departamento_tabela}`}>
                      {getDepartmentName(tarefa.department)}
                    </td>
                    <td className={` p-2 ${Style.text_departamento_tabela}`}>
                      {format(new Date(tarefa.predicted_end), 'dd/MM/yyyy')}
                    </td>
                    <td className={` p-2 bg-body-tertiary ${Style.text_departamento_tabela}`}>
                      <Link to={`/tarefa/edit/${tarefa.id}`} className='text-decoration-none'>
                        <button className={Style.btn_tarefa}>Ver tarefa</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/tarefa">
              <p className={Style.text_vermais}>Ver mais tarefas</p>
            </Link>
          </div>
        </div>

      </Container>
    </div>

  )
}

export default Dashboard