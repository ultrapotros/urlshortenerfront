import React , { useState , useRef, useEffect, createContext, useCallback} from 'react'
import {
  BrowserRouter as Router,
  Routes, Route
} from "react-router-dom";
import './app.css';
import Popup from 'reactjs-popup';
import { useForm } from 'react-hook-form';
import 'reactjs-popup/dist/index.css';
import Header from './components/header'
import FormRegister from './components/register';
import FormLogin from './components/login';
import Profile from './components/profile/index';
import HomePage from './components/homepage';
import Urls from './components/urlslist'
import PageNotFound from './components/404';
import postLogin from './components/helpers/postLogin';
import postNewUser from './components/helpers/postNewUser';
import md5 from 'md5';
export const Context = createContext(null);
export const Logged = createContext(false);

export default function App(){
    const [passwordShown, setPasswordShown] = useState(false)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState('nouser');
    const [logged, setLogged] = useState(false);
    const [newUser, setNewuser] = useState(false);

    const userprueba = useRef();
    const bodyusername = useRef();
    const bodylastname = useRef();
    const bodyfirstname = useRef();
    const bodyemail = useRef();
    const bodypassword = useRef();
    const passwordlogin = useRef();

    const togglePassword = () => {
        setPasswordShown(!passwordShown)
    }

    const getData= useCallback(async () => {
        let usertosearch = userprueba.current.value;
        let passwordtocheck = md5(passwordlogin.current.value);
        await postLogin(usertosearch, passwordtocheck)
            .then ((newData) => {
            setUser({...newData.data});
            setNewuser(false);
            console.log(user);
            setLogged(true);
            window.localStorage.setItem('userlogged',JSON.stringify({...newData.data}));  

        })
    },[user]);
    //urlshortener 
    const { register, handleSubmit, formState: { errors } } = useForm();

    function prueba(e) {
      /* e.preventDefault(); */
      console.log('hola');
    }
    //urlshortener

    const postData= useCallback(async () => {
        let body = {username: bodyusername.current.value, last_name: bodylastname.current.value, 
            first_name: bodyfirstname.current.value, email: bodyemail.current.value, password: bodypassword.current.value};
        await postNewUser(body)
            .then ((newData) => {
            setUser({...newData.data});
            setNewuser(true);
            setLogged(true);
            window.localStorage.setItem('userlogged',JSON.stringify(...newData.data));  
        })
    },[user]);

    useEffect(() => {
        console.log('dentro del useEffect')
        const loggedUserJSON = window.localStorage.getItem('userlogged');
        if (loggedUserJSON) {
            const loggedUser= JSON.parse(loggedUserJSON);
            setUser(loggedUser);
            setLogged(true);
        }            
    }, [])

    return(<> 

            <Context.Provider value={[user,setUser]}>
                <Logged.Provider value={[logged, setLogged]}>
                    <Router>
                        <Header/>
                        <Routes >
                            <Route exact path="/" element={<HomePage />} />
                            <Route path="/register" element={<FormRegister />} />
                            <Route path="/login" element={<FormLogin />} />
                            <Route path="/:username/profile" element={<Profile/>} />
                            <Route path="/:username/urls" element={<Urls/>} />
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </Router>
                </Logged.Provider>
            </Context.Provider>
        {/* } */}
        </>
    )
    }
 



