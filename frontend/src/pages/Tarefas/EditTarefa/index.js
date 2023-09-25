import React, { useState, useEffect } from 'react'
import api from '../../../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import Input from '../../../components/Input'
import Container from '../../../components/Container'
import { toast } from 'react-toastify';
import Style from './EditTarefa.module.css'
import { XLg, Trash3, FiletypePdf, Download } from 'react-bootstrap-icons'
import { Link } from "react-router-dom"
import jsPDF from 'jspdf';
import Logo from '../../../components/Logo/GestWork.png'
import { format } from 'date-fns';
import Select from '../../../components/Select'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { saveAs } from 'file-saver';


function EditTarefa() {
  //Aqui vamos digitar a logica do perfil
  const { id } = useParams(); // Pega o ID da URL
  const [tarefa, setTarefa] = useState({})
  const [edittarefa, setEditarefa] = useState({})
  const [departamento, setDepartamento] = useState([])
  const [token] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [comentario, setComentario] = useState('');
  const [historico, setHistorico] = useState([]);
  const [arquivosTarefa, setArquivosTarefa] = useState([]);

  //Const do select
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPrioridade, setSelectedPrioridade] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [arquiveFile, setArquiveFile] = useState(null);


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

  const handleSelectChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handlePrioridadeChange = (e) => {
    setSelectedPrioridade(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleComentarioChange = (e) => {
    setComentario(e.target.value);
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      api.get('/users/checkuser', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      }).then((response) => {
        setUser(response.data);
      });
    }

    api.get(`/tarefa/view/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setTarefa(response.data.tarefa);
      setEditarefa({ ...response.data.tarefa });
      setSelectedDepartment(response.data.tarefa.department);
      setSelectedStatus(response.data.tarefa.status);
      setSelectedPrioridade(response.data.tarefa.priority);
    }).catch((error) => {
      console.error('Error fetching department:', error);
    });

    api.get(`/tarefa/historico/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    })
      .then((response) => {
        setHistorico(response.data.historico);
      })
      .catch((error) => {
        console.error('Erro ao buscar histórico:', error);
      });

    api.get(`/arquive/list/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    })
      .then((response) => {
        setArquivosTarefa(response.data.arquivos);
      })
      .catch((error) => {
        console.error('Erro ao buscar arquivos:', error);
      });
      
    api.get(`/departamento/mydepartamentos`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    })
      .then((response) => {
        setDepartamento(response.data.departamento);
        console.log(departamento)
      })
      .catch((error) => {
        console.error('Erro ao buscar arquivos:', error);
      });


  }, []);

  async function removeTarefa(id) {
    try {
      await api.delete(`/tarefa/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      const updateTarefa = tarefa.filter((tarefa) => tarefa.id !== id);
      setTarefa(updateTarefa);
      toast.success('Tarefa deletado com sucesso')
      navigate("/tarefa")
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message)
    }
  }

  function handleChange(e) {
    setEditarefa({ ...edittarefa, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dataToSend = {
      ...edittarefa,
      status: selectedStatus,
      priority: selectedPrioridade,
      department: selectedDepartment,
      predicted_end: edittarefa.predicted_end, // Adicione o campo predicted_end

    };


    await api
      .patch(`/tarefa/edit/${id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        toast.success(response.data.message);
        window.location.reload();
        console.log(tarefa)
        return response.data;

      })
      .catch((err) => {
        toast.error(err.response.data.message);
        return err.response.data;
      });
  }

  async function handleSubmitComentario(e) {
    e.preventDefault();

    const dataToSend = {
      comentario: comentario, // Adicione o texto do comentário aqui
      tarefaId: id,
    };


    await api
      .post(`/comentario/create/${id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        toast.success(response.data.message);

        window.location.reload();


        return response.data;
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        return err.response.data;
      });
  }

  const handleArquiveChange = (e) => {
    const file = e.target.files[0];
    setArquiveFile(file); // Defina o arquivo no estado
  };

  const handleSubmitArquive = async (e) => {
    e.preventDefault();

    if (!arquiveFile) {
      toast.error('Por favor, selecione um arquivo.');
      return;
    }

    try {

      const formData = new FormData();
      formData.append('arquivo', arquiveFile);
      formData.append('TarefaID', tarefa.id);
      // Envie o arquivo para o servidor
      await api.post(`/arquive/add/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data', // Certifique-se de definir o tipo de conteúdo correto
        },
      });
      console.log(arquiveFile)
      toast.success('Arquivo carregado com sucesso.');
      window.location.reload();
      // Faça o que for necessário após o envio bem-sucedido, como atualizar a lista de arquivos.
    } catch (error) {
      console.error('Erro ao fazer o upload do arquivo:', error);
      toast.error('Erro ao fazer o upload do arquivo.');
    }
  };

  const handleDownloadArquivo = async (arquivoId, extensao) => {
    try {
      const response = await api.get(`/arquive/download/${arquivoId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });

      const contentDisposition = response.headers['content-disposition'];
      const filenameRegex = /filename[^;=\n]*=(UTF-8['"]*([^;\n]*)|''(.*)|([^;\n]*))/i;
      const matches = filenameRegex.exec(contentDisposition);
      let filename = matches && matches.length > 1 ? matches[2] || matches[3] : 'arquivo';

      // Adicione a extensão ao nome do arquivo
      if (extensao) {
        filename += `.${extensao}`;
      }

      // Aqui definimos o nome do arquivo como o nome do arquivo no banco de dados
      const arquivoInfo = arquivosTarefa.find((arquivo) => arquivo.id === arquivoId);
      if (arquivoInfo) {
        filename = arquivoInfo.arquive;
      }

      saveAs(new Blob([response.data]), filename);
    } catch (error) {
      console.error('Erro ao fazer o download do arquivo:', error);
      toast.error('Erro ao fazer o download do arquivo.');
    }
  };

  // Função para obter o nome do departamento com base no ID
  function getDepartmentName(departmentID) {
    const department = departamento.find((dept) => dept.id === departmentID);
    return department ? department.department : '';
  }

  function generatePDF() {
    const pdf = new jsPDF();

    // Defina a fonte e o tamanho do texto para o cabeçalho
    pdf.setFont('Helvetica');
    pdf.setFontSize(14);

    // Adicione o logotipo ao PDF
    const logoWidth = 17;
    const logoHeight = 5;
    pdf.addImage(Logo, 'PNG', 20, 20, logoWidth, logoHeight);

    // Adicione o cabeçalho com estilo ao lado do logotipo
    pdf.setTextColor(0, 0, 0); // Cor do texto

    // Use o método text para adicionar texto com estilo
    pdf.text(45, 25, `#${tarefa.id_card} - ${tarefa.title}`, { fontStyle: 'bold' });

    // Defina a fonte e o tamanho do texto para as informações
    pdf.setFontSize(12);

    // Adicione informações com estilo
    pdf.text(20, 40, `Descrição: ${tarefa.description}`);
    pdf.text(20, 50, `Status: ${tarefa.status}`);
    // Use a função getDepartmentName para obter o nome do departamento
    const departmentName = getDepartmentName(tarefa.department);
    pdf.text(20, 60, `Departamento: ${departmentName}`);

    pdf.text(20, 70, `Prioridade: ${tarefa.priority}`);
    pdf.text(20, 80, `Previsão de término: ${format(new Date(tarefa.predicted_end), 'dd/MM/yyyy')}`);
    pdf.text(20, 90, `Criada em: ${format(new Date(tarefa.createdAt), 'dd/MM/yyyy')}`);
    pdf.text(20, 100, `Ultima alteração em: ${format(new Date(tarefa.updatedAt), 'dd/MM/yyyy')}`);


    // Adicione os comentários
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    // Adicione o histórico
    if (historico.length > 0) {
      pdf.setFontSize(10);
      pdf.setTextColor(40, 69, 102); // Cor do texto
      pdf.text(20, 130, 'Histórico de Alterações:');
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0); // Cor do texto

      // Loop através do histórico e adicione cada entrada como uma linha de texto
      let startY = 140;

      historico.forEach((item) => {
        const historicalText = `- ${user.name} alterou a tarefa em ${format(new Date(item.data_alteracao), 'dd/MM/yyyy HH:mm')}: ${item.descricao}`;
        const lines = pdf.splitTextToSize(historicalText, 170); // 170 é a largura máxima da linha
        const pageHeight = pdf.internal.pageSize.height;

        // Verifique se a próxima linha cabe na página atual
        if (startY + lines.length * 12 > pageHeight - 20) {
          pdf.addPage();
          startY = 20; // Reinicie a partir do topo da nova página
        }

        // Adicione as linhas de texto
        lines.forEach((line) => {
          pdf.text(20, startY, line);
          startY += 5; // Espaçamento entre linhas
        });
      });
    }



    // Estilize o rodapé
    pdf.setTextColor(40, 69, 102); // Cor do texto
    pdf.setFontSize(10);
    pdf.text(20, 280, `Este relatório foi gerado em: ${new Date().toLocaleString()}`);

    // Salve o PDF
    pdf.save(`${tarefa.id_card}.pdf`);
  }

  const handleExcluirArquivo = async (arquivoId) => {
    try {
      await api.delete(`/arquive/delete/${arquivoId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });

      setArquivosTarefa(arquivosTarefa.filter(arquivo => arquivo.id !== arquivoId));

      toast.success('Arquivo excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir o arquivo:', error);
      toast.error('Erro ao excluir o arquivo.');
    }
  };



  return (
    <Container>
      <div className={Style.fundo_conteudo}>

        <div className={Style.fundo_container}>
          <div className='d-flex'>
            <div className={`w-100 d-flex ${Style.title_formatacao}`}>
              <h1 className={Style.text_title}>#{tarefa.id_card} - {tarefa.title} </h1>

              <OverlayTrigger
                key="tooltip-pdf"
                placement="top"
                overlay={
                  <Tooltip id="tooltip-pdf">
                    Gerar PDF
                  </Tooltip>
                }
              >
                <button
                  type='button'
                  onClick={generatePDF}
                  className={Style.formatacao_btn_pdf}
                >
                  <FiletypePdf />
                </button>
              </OverlayTrigger>



            </div>

            <Link className={Style.btn_link_close} to="/tarefa">
              <div className={Style.btn_close}>
                <XLg />
              </div>
            </Link>
          </div>
          <hr></hr>
          <form onSubmit={handleSubmit}>
            <div className='d-flex'>
              <div className='w-75'>
                <Input
                  className={`form-control `}
                  type='text'
                  name='title'
                  handleChange={handleChange}
                  label="Titulo da tarefa:"
                  value={edittarefa.title} // Defina o valor do input com o valor de tarefa.name
                />
              </div>
              <div className='ms-5 w-50'>
                <Input
                  className={`form-control `}
                  type='date'
                  name='predicted_end'
                  handleChange={handleChange} // Altere para handleDateChange
                  label="Previsão de termino:"
                  value={edittarefa.predicted_end} // Defina o valor do input com o valor de tarefa.name

                />
              </div>
            </div>
            <label className={`form-label mt-4`}>
              Descrição da tarefa:
            </label>
            <textarea
              className={`form-control ${Style.caixa_De_texto} ${Style.description - Input}`}
              name='description'
              label='Descrição da tarefa:'
              onChange={handleChange}
              value={edittarefa.description}
            ></textarea>
            <div className='w-100 d-flex mt-2'>
              <div className='w-50'>
                <Select
                  className="form-select"
                  options={optionsStatus}
                  name="status"
                  value={selectedStatus}
                  handleChange={handleSelectChange}
                  label="Status:"
                />
              </div>
              <div className='ms-5 w-50'>
                <Select
                  className={`form-select`}
                  options={optionsPrioridade}
                  name=""
                  value={selectedPrioridade}
                  handleChange={handlePrioridadeChange}
                  label="Prioridade:"
                />
              </div>
            </div>
            <label className={`form-label mt-2`}>
              Departamento:
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

            <div className='d-flex w-100'>
              <div className='mt-4 w-75'>
                <button type='submit' className={`w-100 ${Style.btn_criar}`}>
                  ATUALIZAR
                </button>
              </div>

              <div className='mt-4 ms-2 w-25'>
                <button className={`w-100 ${Style.btn_deletar}`} onClick={() => { removeTarefa(tarefa.id) }}>
                  <Trash3 className='fs-5' />
                </button>
              </div>


            </div>

          </form>
        </div>


        <div className={Style.fundo_info}>
          <div className={Style.fundo_tamanho_historico}>
            {historico.length > 0 && (
              <div className={`border rounded p-4 ${Style.container_historico}`}>
                <h6 className='text-start mb-3'>HISTÓRICO DE ALTERAÇÃO</h6>
                {historico.map((item) => (
                  <li key={item.id} className=" list-group-item bg-transparent">
                    <div className="card bg-secondary-subtle border-0 ">
                      <div className={` ${Style.fundo_historico}`}>
                        <p className={`text-start text-black ms-3 me-2 ${Style.font_historico}`}>
                          {`${user.name} alterou a tarefa em ${new Date(item.data_alteracao).toLocaleString()}, ${item.descricao}`}
                        </p>
                      </div>
                    </div>
                    <hr className='m-0 mt-2 mb-2'></hr>
                  </li>

                ))}

                <li className="list-group-item bg-transparent">
                  <div className="card bg-secondary-subtle border-0">
                    <div className={` ${Style.fundo_historico}`}>
                      <p className={`text-start text-black ms-3 me-2 ${Style.font_historico}`}>
                        {`${user.name} criou a tarefa em ${new Date(tarefa.createdAt).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <hr className='m-0 mt-2 mb-2'></hr>
                </li>
              </div>
            )}
          </div>


          <div className={Style.fundo_arquive}>
            <div className={`border rounded p-4  ${Style.fundo_comentario}`}>
              <form onSubmit={(e) => handleSubmitArquive(e, tarefa.id)}>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    id="arquivo"
                    name="arquivo"
                    onChange={handleArquiveChange}
                  />
                </div>
                <button type="submit" className={`w-100 ${Style.btn_criar}`}>
                  Anexar arquivo
                </button>
              </form>

              <div className={Style.linha_arquivo}></div>

              {arquivosTarefa.map((arquivo) => (
                <li key={arquivo.id} className="border rounded p-1 d-flex mb-2 justify-content-between align-items-center ">
                  <div className={Style.text_arquivo}>
                    {arquivo.arquive}
                  </div>
                  <div>

                    <button
                      className={Style.botao_salvar}
                      onClick={() => handleDownloadArquivo(arquivo.id, arquivo.extensao)}
                    >
                      <Download />
                    </button>


                    <button
                      className={Style.deletar}
                      onClick={() => handleExcluirArquivo(arquivo.id)}
                    >
                      <Trash3 />
                    </button>




                  </div>
                </li>
              ))}

            </div>

            <div className={`border rounded p-4 mt-3 ${Style.fundo_comentario}`}>
              <h6 className="text-start mb-3">ADICIONAR COMENTARIO:</h6>
              <form onSubmit={handleSubmitComentario}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    id="comentario"
                    name="comentario"
                    value={comentario}
                    placeholder='Ex: Tarefa cancelada devido a empecilho.'
                    onChange={handleComentarioChange}
                  />
                </div>
                <button type='submit' className={`w-100 ${Style.btn_criar}`}>
                  CRIAR COMENTARIO
                </button>
              </form>
            </div>


            {/* Formulário para envio de arquivo */}



          </div>
        </div>

      </div>

    </Container >
  );
}

export default EditTarefa;