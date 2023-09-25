import { Link, useParams } from "react-router-dom"
import Container from "../../../components/Container"
import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Style from './MyTarefa.module.css'
import classNames from 'classnames';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ClockHistory, Plus, Kanban, Search } from "react-bootstrap-icons";
import Draggable from 'react-draggable'

function MyTarefas() {

  const [user, setUser] = useState({})
  const [tarefa, setTarefa] = useState([])
  const [token] = useState(localStorage.getItem('token') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('');
  const [departamento, setDepartamento] = useState({});

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

      api.get('/tarefa/mytarefa', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }).then((response) => {
        setTarefa(response.data.tarefa);
      });

      api.get('/departamento/mydepartamentos')
        .then((response) => {
          // Atualize o estado com os valores obtidos da API
          const departmentMap = {};
          response.data.departamento.forEach((dep) => {
            departmentMap[dep.id] = dep.department;
          });
          setDepartamento(departmentMap);
          console.log(departmentMap);
        })
        .catch((err) => {
          console.error('Erro ao buscar valores de department:', err);
        });
    }

  }, [token, navigate])


  console.log(selectedDepartmentFilter)

  const tarefasAFazer = tarefa.filter(t => t.status === 'fazer');
  const tarefasEmAndamento = tarefa.filter(t => t.status === 'andamento');
  const tarefasConcluidas = tarefa.filter(t => t.status === 'concluida');
  const tarefasCanceladas = tarefa.filter(t => t.status === 'cancelada')

  function calcularDiasRestantesOuAtraso(dataPrevista) {
    const hoje = new Date();
    const dataPrevistaDate = parseISO(dataPrevista);
    const diferencaDias = differenceInDays(dataPrevistaDate, hoje);

    if (diferencaDias > 0) {
      return `${diferencaDias} dias`;
    } else if (diferencaDias === 0) {
      return '0 Dias';
    } else {
      return `${Math.abs(diferencaDias)}D atraso`;
    }
  }

  function getStatusLabelClass(dataPrevista) {
    const hoje = new Date();
    const dataPrevistaDate = parseISO(dataPrevista);
    const diferencaDias = differenceInDays(dataPrevistaDate, hoje);

    if (diferencaDias > 0) {
      return 'text-black'; // Tarefa em dia (preto)
    } else if (diferencaDias === 0) {
      return 'text-warning'; // Tarefa vence no dia (amarelo)
    } else {
      return 'text-danger'; // Tarefa em atraso (vermelho)
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentFilterChange = (e) => {
    setSelectedDepartmentFilter(e.target.value);
  };


  return (

    <div>
      <Container>
        <div className={Style.menu_option}>
          <Link className={` ${Style.option_btn_select}`} to="#">
            KANBAN
          </Link>
          <div className={Style.search}>
            <input
              className={`form-control w-100`}
              type="text"
              placeholder={`Pesquisar por ID ou título`}
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <Search className={`fs-3 ms-2 ${Style.lupa}`} />
          </div>

          <div className={Style.department_filter}>
            <select
              className="form-select"
              value={selectedDepartmentFilter}
              onChange={handleDepartmentFilterChange}
            >
              <option value="">Filtrar por departamento</option>
              {Object.entries(departamento).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>

          </div>

          <Link className={`${Style.create_btn}`} to="/tarefa/create">Criar tarefa</Link>
        </div>

        <div className={Style.menu_cartoes}>

          {/* //A FAZER  */}
          <div className={`${Style.colunas}`}>
            <div className={Style.afazer}>A fazer</div>
            {tarefasAFazer
              .filter(
                (tarefa) =>
                  tarefa.status === 'fazer' &&
                  (tarefa.id_card.includes(searchTerm) ||
                    tarefa.title.includes(searchTerm)) &&
                    (selectedDepartmentFilter === '' || departamento[selectedDepartmentFilter] === departamento[tarefa.department])

              )
              .map((tarefa) => (

                <Draggable
                >
                  <div className={classNames(Style.card, { [Style.fazer_card]: tarefa.status === 'fazer' })} key={tarefa.id_card}>
                    <div className="card mb-1 mt-2 w-100">
                      <div className={`card-body`}>
                        <div className="d-flex text-center align-items-center">
                          <p className="text-black fs-6 ">#{tarefa.id_card}</p>
                          <p className={classNames(getStatusLabelClass(tarefa.predicted_end))}>
                            <ClockHistory className="ms-2 fs-6" />
                          </p>
                        </div>

                        <p className={`text-black text-start fs-7 ${Style.text_title}`}>{tarefa.title}</p>
                        <hr></hr>

                        <div className="d-flex align-items-center">
                          <div className="">
                            <Plus className="fs-4" />
                          </div>

                          <div className="bg-white">
                            <p className={Style.text_ver_mais}>
                              <Link to={`/tarefa/edit/${tarefa.id}`} className={classNames("text-decoration-none", {
                                "text-black": calcularDiasRestantesOuAtraso(tarefa.predicted_end).includes("dias"),
                                "text-warning": calcularDiasRestantesOuAtraso(tarefa.predicted_end) === "0 Dias",
                                "text-danger": calcularDiasRestantesOuAtraso(tarefa.predicted_end).includes("atraso"),
                              })}>
                                Ver tarefa
                              </Link>
                            </p>
                          </div>

                        </div>


                      </div>
                    </div>
                  </div>
                </Draggable>


              ))}
          </div>

          {/* COLUNA  */}
          <div className={Style.margem_colunas}></div>

          {/* ANDAMENTO  */}
          <div className={`${Style.colunas}`}>
            <div className={Style.andamento}>Em andamento</div>
            {tarefasEmAndamento
              .filter(
                (tarefa) =>
                  tarefa.status === 'andamento' &&
                  (tarefa.id_card.includes(searchTerm) ||
                    tarefa.title.includes(searchTerm)) &&
                    (selectedDepartmentFilter === '' || departamento[selectedDepartmentFilter] === departamento[tarefa.department])
                    )

              .map((tarefa) => (
                <div className={classNames(Style.card, { [Style.andamento_card]: tarefa.status === 'andamento' })} key={tarefa.id_card}>
                  <div className="card mb-1 mt-2">
                    <div className={`card-body`}>
                      <div className="d-flex text-center align-items-center">
                        <p className="text-black fs-6 ">#{tarefa.id_card}</p>
                        <p className={classNames(getStatusLabelClass(tarefa.predicted_end))}>
                          <ClockHistory className="ms-2 fs-6" />
                        </p>
                      </div>

                      <p className={`text-black text-start fs-7 ${Style.text_title}`}>{tarefa.title}</p>
                      <hr></hr>

                      <div className="d-flex align-items-center">
                        <div className="">
                          <Plus className="fs-4" />
                        </div>

                        <div className="bg-white">
                          <p className={Style.text_ver_mais}>
                            <Link to={`/tarefa/edit/${tarefa.id}`} className={classNames("text-decoration-none", {
                              "text-black": calcularDiasRestantesOuAtraso(tarefa.predicted_end).includes("dias"),
                              "text-warning": calcularDiasRestantesOuAtraso(tarefa.predicted_end) === "0 Dias",
                              "text-danger": calcularDiasRestantesOuAtraso(tarefa.predicted_end).includes("atraso"),
                            })}>
                              Ver tarefa
                            </Link>
                          </p>
                        </div>

                      </div>


                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* COLUNA  */}
          <div className={Style.margem_colunas}></div>

          {/* CONCLUIDA  */}
          <div className={`${Style.colunas}`}>
            <div className={Style.concluida}>Concluída</div>
            {tarefasConcluidas
              .filter(
                (tarefa) =>
                  tarefa.status === 'concluida' &&
                  (tarefa.id_card.includes(searchTerm) ||
                    tarefa.title.includes(searchTerm)) &&
                    (selectedDepartmentFilter === '' || departamento[selectedDepartmentFilter] === departamento[tarefa.department])

              )
              .map((tarefa) => (
                <div className={classNames(Style.card, { [Style.concluida_card]: tarefa.status === 'concluida' })} key={tarefa.id_card}>
                  <div className="card mb-1 mt-2">
                    <div className={`card-body`}>
                      <div className="d-flex text-center align-items-center">
                        <p className="text-black fs-6 ">#{tarefa.id_card}</p>
                        <p className="text-success">
                          <ClockHistory className="ms-2 fs-6" />
                        </p>
                      </div>

                      <p className={`text-black text-start fs-7 ${Style.text_title}`}>{tarefa.title}</p>
                      <hr></hr>

                      <div className="d-flex align-items-center">
                        <div className="">
                          <Plus className="fs-4" />
                        </div>

                        <div className="bg-white">
                          <p className={Style.text_ver_mais}>
                            <Link to={`/tarefa/edit/${tarefa.id}`} className="text-decoration-none text-success ">Ver tarefa</Link>
                          </p>
                        </div>

                      </div>


                    </div>
                  </div>
                </div>
              ))}
          </div>
          {/* COLUNA  */}

          <div className={Style.margem_colunas}></div>
          {/* CANCELADA  */}
          <div className={` ${Style.colunas}`}>
            <div className={Style.cancelada}>Cancelada</div>
            {tarefasCanceladas
              .filter(
                (tarefa) =>
                  tarefa.status === 'cancelada' &&
                  (tarefa.id_card.includes(searchTerm) ||
                    tarefa.title.includes(searchTerm)) &&
                    (selectedDepartmentFilter === '' || departamento[selectedDepartmentFilter] === departamento[tarefa.department])

              )
              .map((tarefa) => (
                <div className={classNames(Style.card, { [Style.cancelada_card]: tarefa.status === 'cancelada' })} key={tarefa.id_card}>
                  <div className="card mb-1 mt-2">
                    <div className="card-body">
                      <div className="d-flex text-center align-items-center">
                        <p className="text-black fs-6 ">#{tarefa.id_card}</p>
                        <p className="text-secondary">
                          <ClockHistory className="ms-2 fs-6" />
                        </p>
                      </div>
                      <p className={`text-black text-start fs-7 ${Style.text_title}`}>{tarefa.title}</p>
                      <hr></hr>
                      <div className="d-flex align-items-center">
                        <div className="">
                          <Plus className="fs-4" />
                        </div>

                        <div className="bg-white">
                          <p className={Style.text_ver_mais}>
                            <Link to={`/tarefa/edit/${tarefa.id}`} className="text-decoration-none text-secondary ">Ver tarefa</Link>
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              ))}
          </div>

        </div>
      </Container>
    </div>
  )
}

export default MyTarefas
