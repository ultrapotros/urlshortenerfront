import './header.css'
import { useContext , useState, useEffect} from 'react';
import { NavLink} from 'react-router-dom';

import {Context} from '../../App';
import {Logged} from '../../App';

export default function Header(){
    const data =  useContext(Context); //logged user data
    const [user,setUser] = useContext(Context);
    const [logged, setLogged] = useContext(Logged);
    /* const [logged, setLogged] = useState(false); */
  /*   const loggedUserJSON = window.localStorage.getItem('userlogged');
    if (loggedUserJSON) {
        const loggedUser= JSON.parse(loggedUserJSON);
        setLogged(true);
    } */
    const handleLogout = (()=> {
        window.localStorage.removeItem('userlogged');
        window.localStorage.removeItem('usertoken');
        setUser('nouser');
        setLogged(false);
    })
    const handleLogin = (()=> {
        console.log(user);
    })
    useEffect(() => {
        console.log('dentro del useEffect del header')
/*         const loggedUserJSON = window.localStorage.getItem('userlogged');
        if (loggedUserJSON) {
            const loggedUser= JSON.parse(loggedUserJSON);
            setUser(loggedUser);
            setLogged(true);
        }      */       
    }, [logged])
    console.log(user)
    return(
        <div className='top-header'>
            <nav className='header-nav'>
                {logged ? <NavLink className='name' to ={`/${user.username}/profile`}>Profile</NavLink> : 
                <NavLink className='name' to ={`/register`}>Register</NavLink>} {/* aqui hay que redireccionar al componente con el formulario de registro */}
                {logged ? <NavLink className='logout' to ={`/`} onClick = {handleLogout}>logout</NavLink> : 
                <NavLink className='logout' to ={`/login`} onClick = {handleLogin}>login</NavLink>}
            </nav>
        </div>
    )

}