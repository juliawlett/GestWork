// Importando as dependências necessárias do React e ReactDOM.
import React from 'react'

// Certifique-se de importar o componente Input apropriado
import Input from '../../../components/Input'

// Links de navegação suave
import { Link } from 'react-router-dom'

// Importando os estilos locais.
import Style from './Register.module.css'
import Logo from '../../../components/Logo/GestWork.png'

//hooks
import { useContext, useState } from 'react'

//context
import { Context } from '../../../context/UserContext'
import { toast } from 'react-toastify'


function Register() {
    //aqui eu crio funções e logica apar resolver uma tela
    const [user, setUser] = useState({})
    const { register } = useContext(Context)
    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
        //{...user} cria uma cópia do objeto atual, usando a sintaxe de espalhamento(...),
        //essa cópia é feita para preservar os valores no objeto antes de fazer atualização
    }

    function handleSubmit(e) {
        e.preventDefault()

        console.log(user)
        register(user)
    }


    return (
        <div className=' h-100'>
            <div className={Style.register__container}>
                {/* lado esquerdo */}
                <div className='w-50'>
                    <div className={Style.logo}>
                        <h5 className={Style.logo__titulo}>Bem-vindo ao</h5>
                        <img src={Logo} className={Style.logo__img} />
                        <div className={Style.linha__logo}></div>

                        <h5 className={Style.texto__logo}>Já possui cadastro?
                            <br></br>
                            Entre na sua conta agora
                        </h5>

                        <div className={Style.botao__logo}>
                            <Link to="/" className={Style.botao__text}> ACESSAR A CONTA</Link>
                        </div>
                    </div>
                </div>

                {/* lado direito */}
                <div className={Style.login}>
                    <div className={Style.titulo}>
                        <h3 className={Style.titulo_texto_um}>Crie sua conta no</h3>
                        <h2 className={Style.titulo_texto_dois}>GestWork!</h2>
                    </div>
                    <div className={Style.formulario}>
                        <form onSubmit={handleSubmit} className={Style.formulario__login}>
                            {/* Nome do User */}
                            <Input
                                className='form-control'
                                display='d-none'
                                type='text'
                                placeholder='Digite seu nome'
                                name='name'
                                handleChange={handleChange}
                            />
                            {/* email do user */}
                            <Input
                                className={`form-control mt-4 ${Style.hover_form}`}
                                type='email'
                                display='d-none'
                                placeholder='Digite seu email'
                                name='email'
                                handleChange={handleChange}
                            />
                            {/* telefone do user */}
                            <Input
                                className='form-control mt-4'
                                type='tel'
                                placeholder='Digite seu telefone'
                                name='phone'
                                display='d-none'
                                handleChange={handleChange}
                            />
                            {/* senha do user */}
                            <Input
                                className='form-control mt-4'
                                type='password'
                                placeholder='Digite sua senha'
                                name='password'
                                display='d-none'
                                handleChange={handleChange}
                            />
                            {/* confirmar senha do user */}
                            <Input
                                className='form-control mt-4'
                                type='password'
                                placeholder='Confirme sua senha'
                                name='confirmpassword'
                                display='d-none'
                                handleChange={handleChange}
                            />
                            <button type='submit' className={`mt-5  w-100 ${Style.botao__logo}`} >REGISTRAR</button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Register