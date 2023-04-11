import './header.css'
import { useContext , useEffect} from 'react';
import { NavLink} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import {Context} from '../../App';
import {Logged} from '../../App';

export default function Header(){
    const [user,setUser] = useContext(Context);
    const [logged, setLogged] = useContext(Logged);
    const [t, i18n] = useTranslation("global");

    const handleLogout = (()=> {
        window.localStorage.removeItem('userlogged');
        window.localStorage.removeItem('usertoken');
        setUser('nouser');
        setLogged(false);
    })
    const handleLogin = (()=> {
    })
    useEffect(() => {
 
    }, [logged])
    return(
        <div className='top-header'>
            <nav className='header-nav'>
                {logged ? <NavLink className='name' to ={`/profile/${user.user.username}`}>{t("header.profile")}</NavLink> : 
                <NavLink className='name' to ={`/register`}>{t("header.register")}</NavLink>}
                {logged ? <NavLink className='logout' to ={`/`} onClick = {handleLogout}>{t("header.logout")}</NavLink> : 
                <NavLink className='logout' to ={`/login`} /* onClick = {handleLogin} */>{t("header.login")}</NavLink>}
                <div className='language--buttons'>
                    <button onClick={()=>i18n.changeLanguage('es')}>ES</button>
                    <button onClick={()=>i18n.changeLanguage('en')}>EN</button>
                </div>
            </nav>
        </div>
    )

}