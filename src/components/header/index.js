import './header.css'
import { useContext , useState, useEffect} from 'react';
import { NavLink} from 'react-router-dom';
import { logOut } from '../helpers/cognito';
import { useTranslation } from "react-i18next";
import {Context} from '../../App';
import {Logged} from '../../App';


export default function Header(){
    const data =  useContext(Context); //logged user data
    const [user,setUser] = useContext(Context);
    const [logged, setLogged] = useContext(Logged);
    const [t, i18n] = useTranslation("global");

    const handleLogout = (async ()=> {
        setUser('nouser');
        setLogged(false);
        await logOut();
    })

/*     useEffect(() => {    
    }, [])
 */
    return(
        <div className='top-header'>
            <nav className='header-nav'>
                {logged ? <NavLink className='simple--button' to ={`/${user.username}/profile`}>{t("header.profile")}</NavLink> : 
                <NavLink className='simple--button' to ={`/register`}>{t("header.register")}</NavLink>} {/* aqui hay que redireccionar al componente con el formulario de registro */}
                {logged ? <NavLink className='simple--button' to ={`/`} onClick = {handleLogout}>{t("header.logout")}</NavLink> : 
                <NavLink className='simple--button' to ={`/login`}>{t("header.login")}</NavLink>}
                <div className='language--buttons'>
                    <button className='simple--button' onClick={()=>i18n.changeLanguage('es')}>ES</button>
                    <button className='simple--button' onClick={()=>i18n.changeLanguage('en')}>EN</button>
                </div>
            </nav>
        </div>
    )
    }
