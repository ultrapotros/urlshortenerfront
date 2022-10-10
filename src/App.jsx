import React , { useState , useEffect, createContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './app.css';
import Header from './components/header'
import FormRegister from './components/register';
import FormLogin from './components/login';
import Profile from './components/profile/index';
import HomePage from './components/homepage';
import Redirect from './components/redirect';
import Urls from './components/urlslist'
import PageNotFound from './components/404';
export const Context = createContext({});
export const Logged = createContext(false);

export default function App(){
    const [user, setUser] = useState({});
    const [logged, setLogged] = useState(false);



    useEffect(() => {
        console.log('dentro del useEffect')
        const loggedUserJSON = window.localStorage.getItem('userlogged');
        const userTokenJSON = window.localStorage.getItem('usertoken');
        if (loggedUserJSON) {
            const user= JSON.parse(loggedUserJSON);
            const token= JSON.parse(userTokenJSON);
            setUser({user,token});
            setLogged(true);
        }            
    }, [])

    return(<> 
            <div className="top-background"></div>
           {/*  <div className="bottom-background"></div> */}
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
                            <Route path="/:shortid" element={<Redirect/>} />
                        </Routes>
                    </Router>
                </Logged.Provider>
            </Context.Provider>
        {/* } */}
        </>
    )
    }
 



