import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../../context/UserContext'
import Style from './Navbar.module.css'
import Logo from './GestWorkGW.png'
import LogoDois from '../Logo/GestWork.png'
import { Trello } from "react-bootstrap-icons";
import { PlusLg } from "react-bootstrap-icons";
import { Gear } from "react-bootstrap-icons";
import { BoxArrowLeft } from "react-bootstrap-icons";
import api from '../../utils/api'




function NavBar() {
    const { authenticated, logout } = useContext(Context)
    const [user, setUser] = useState({})
    const [preview, setPreview] = useState()
    const [token, setToken] = useState(localStorage.getItem('token') || '');


    useEffect(() => {
        if (!token) {
            console.log('Por favor faça o login')
        } else {
            api.get('/users/checkuser', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            }).then((response) => {
                setUser(response.data)
            })
        }
    }, [token])


    return (
        <div div className={Style.fundo} >
            {!authenticated ? (
                <>

                    <div className={Style.fundo_login_register_tamanho}>
                        <div className={Style.alinhamento_login_register_tamanho}>
                            <div className={Style.container_imagem_menu_navbar_login}>
                                <Link to="/">
                                    <img src={LogoDois} className={Style.logo_img_menu_navbar_login} />
                                </Link>
                            </div>
                            <div className={Style.alinhamento_login_register_tamanho_color}>
                                <p className='text-black'>Para você acessar essa pagina é necessario a autenticação: </p>

                                <Link to="/" className={Style.link_menu_navba_login_register}>
                                    <div className={Style.btn_login_register}>
                                        <p className={Style.p_login_register}>LOGIN</p>
                                    </div>
                                </Link>
                                <br></br>

                                <Link to="/" className={Style.link_menu_navba_login_register}>
                                    <div className={Style.btn_login_register}>
                                        <p className={Style.p_login_register}>REGISTRAR</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                </>
            ) : (

                <>
                    <div div className={Style.fundo_menu_navbar} >
                        <div>
                            {/* logo  */}
                            <div className={Style.container_imagem_menu_navbar}>
                                <Link to="/dashboard">
                                    <img src={Logo} className={Style.logo_img_menu_navbar} />
                                </Link>
                            </div>

                            {/* linha entre itens  */}
                            <div className={Style.tamanho_linha_entre_menu_navbar}>
                                <div className={Style.linha_entre_menu_navbar}>
                                </div>
                            </div>


                            {/* link dashboard  */}
                            <div className={Style.container_imagem_menu_navbar_dois}>
                                <Link to="/dashboard" className={Style.link_menu_navbar}>
                                    <div className={Style.tamanho_icon_menu_navbar}>
                                        <Trello className={Style.icon_menu_navbar} />
                                        <p className={Style.texto_menu_navbar}>DASH</p>
                                    </div>
                                </Link>
                            </div>



                            {/* link tarefa  */}
                            <div className={Style.container_imagem_menu_navbar_dois}>
                                <Link to="/tarefa" className={Style.link_menu_navbar}>
                                    <div className={Style.tamanho_icon_menu_navbar}>
                                        <PlusLg className={Style.icon_menu_navbar} />
                                        <p className={Style.texto_menu_navbar}>TAREFA</p>
                                    </div>
                                </Link>
                            </div>

                            <div className={Style.container_imagem_menu_navbar_dois}>
                                <Link to="/tarefa" className={Style.link_menu_navbar}>
                                    <div className={Style.tamanho_icon_menu_navbar}>
                                        <Gear className={Style.icon_menu_navbar} />
                                        <p className={Style.texto_menu_navbar}>CONF.</p>
                                    </div>
                                </Link>
                            </div>



                            {/* link perfil  */}
                            <div className={Style.container_imagem_menu_navbar_dois}>
                                <Link to="/user/profile" className={Style.link_menu_navbar}>
                                    <div className={Style.tamanho_icon_menu_navbar}>
                                        <img
                                            className={` ${Style.tamanho_imagem_perfil}`}

                                            src={
                                                user.image
                                                  ? 'http://localhost:8000/images/users/' + user.image
                                                  : 'https://i.pinimg.com/originals/a0/4d/84/a04d849cf591c2f980548b982f461401.jpg' // Substitua pela URL da imagem padrão
                                              }
                                              alt={user}

                                        />
                                        <p className={Style.texto_menu_navbar}>PERFIL</p>
                                    </div>
                                </Link>
                            </div>

                            <div className={Style.container_imagem_menu_navbar_tres} onClick={logout}>
                                <div className={Style.tamanho_icon_menu_navbar}>
                                    <p className={Style.texto_menu_navbar}> <BoxArrowLeft /> SAIR</p>
                                </div>
                            </div>




                        </div>

                    </div >
                </>
            )}
        </div>
    )

}

export default NavBar