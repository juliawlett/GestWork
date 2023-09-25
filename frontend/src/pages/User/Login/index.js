// Importando as dependências necessárias do React e ReactDOM.
import React from 'react'

// Certifique-se de importar o componente Input apropriado
import Input from '../../../components/Input'

// Importando os estilos locais.
import Style from './Register.module.css'
import Logo from '../../../components/Logo/GestWork.png'

// Links de navegação suave
import { Link } from 'react-router-dom'

//Context
import { Context } from '../../../context/UserContext'
import { useContext, useState } from 'react'



function Login() {
    const [user, setUser] = useState({}) //Vazio para evitar erro
    const { login } = useContext(Context)

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        login(user)
    }

    return (
        <div className=' h-100'>
            {/* <Container> */}
            <div className={Style.register__container}>
                {/* lado esquerdo */}
                <div className='w-50'>
                    <div className={Style.logo}>
                        <h5 className={Style.logo__titulo}>Bem-vindo ao</h5>
                        <img src={Logo} className={Style.logo__img} />
                        <div className={Style.linha__logo}></div>

                        <h5 className={Style.texto__logo}>Não possui cadastro?
                            <br></br>
                            Registre sua conta agora
                        </h5>

                        <div className={Style.botao__logo}>
                            <Link to="/register" className={Style.botao__text}> CRIAR CONTA</Link>
                        </div>
                    </div>
                </div>

                {/* lado direito */}
                <div className={Style.login}>
                    <div className={Style.titulo}>
                        <h3 className={Style.titulo_texto_um}>Acesse sua conta no</h3>
                        <h2 className={Style.titulo_texto_dois}>GestWork!</h2>
                    </div>
                    <div className={Style.formulario}>
                        <form onSubmit={handleSubmit} className={Style.formulario__login}>
                            {/* email do user */}
                            <Input
                                className='form-control'
                                type='email'
                                placeholder='Digite seu email'
                                name='email'
                                display='d-none'
                                handleChange={handleChange}
                            />
                            {/* senha do user */}
                            <Input
                                className='form-control mt-4'
                                type='password'
                                placeholder='Digite sua senha'
                                display='d-none'
                                name='password'
                                handleChange={handleChange}
                            />
                            <button type='submit' className={`mt-5  w-100 ${Style.botao__logo}`} >ENTRAR</button>
                        </form>
                    </div>
                </div>

            </div>
            {/* </Container> */}
        </div>
    )
}

export default Login