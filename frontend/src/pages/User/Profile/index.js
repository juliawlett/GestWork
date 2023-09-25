import React, { useState, useEffect } from 'react'
import api from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import Input from '../../../components/Input'
import Style from './Profile.module.css';
import Container from '../../../components/Container'
import { toast } from 'react-toastify';


function Profile() {
  //Aqui vamos digitar a logica do perfil
  const [user, setUser] = useState({})
  const [preview, setPreview] = useState()
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
    }
  }, [token, navigate])

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  //trabalhando com a imagem
  const [image, setImage] = useState(null)

  function onFileChange(e) {
    setPreview(URL.createObjectURL(e.target.files[0]))
    setImage(e.target.files[0])
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()

    //adiciona a imagem ao formdata (se ela existir)
    if (image) {
      formData.append('image', image)
    }


    //adiciona as outras propriedades do usuario ao formData
    await Object.keys(user).forEach((key) => formData.append(key, user[key]))

    const data = await api.patch(`users/edit/${user.id}`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      return response.data
    }).catch((err) => {
      toast.error(err.response.data)
      return err.response.data
    })

    toast.success(data.message)
  }

  return (
    <div className={Style.tamanho_container_navbar_form}>
      <Container>
        <div className={Style.container_form_perfil}>
          <h1 className={Style.texto_form}>Olá, {user.name}.</h1>
          <label htmlFor="profileImageInput">
            <img
              style={{ height: '200px', width: '200px', cursor: 'pointer' }}
              className={Style.tamanho_imagem_perfil}
              src={
                user.image
                  ? 'http://localhost:8000/images/users/' + user.image
                  : 'https://i.pinimg.com/originals/a0/4d/84/a04d849cf591c2f980548b982f461401.jpg' // Substitua pela URL da imagem padrão

              }
              alt='Foto de perfil'
            />
          </label>
          <input
            id="profileImageInput"
            type="file"
            name="image"
            onChange={onFileChange}
            style={{ display: 'none' }}
          />
          <form onSubmit={handleSubmit} className={Style.formulario}>
            <Input
              className={`form-control mt-3  ${Style.tamanho_input}`}
              type='text'
              name='name'
              placeholder='Digite seu nome'
              handleChange={handleChange}
              display='d-none'
              value={user.name}
            />
            <Input
              className={`form-control mt-4 ${Style.tamanho_input}`}
              type='email'
              name='email'
              placeholder='Digite seu email'
              display='d-none'
              handleChange={handleChange}
              value={user.email}
            />
            <Input
              className={`form-control mt-4  ${Style.tamanho_input}`}
              type='phone'
              name='phone'
              placeholder='Digite seu phone'
              display='d-none'
              handleChange={handleChange}
              value={user.phone}
            />
            <Input
              className={`form-control mt-4  ${Style.tamanho_input}`}
              type='password'
              name='password'
              display='d-none'
              placeholder='Digite seu password'
              handleChange={handleChange}
            />
            <Input
              className={`form-control mt-4  ${Style.tamanho_input}`}
              type='password'
              name='confirmpassword'
              placeholder='Digite seu password'
              display='d-none'
              handleChange={handleChange}
            />

            <button type='submit' className={`mt-5 mb-3 ${Style.botao_form}`}>
              ATUALIZAR
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Profile;
