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
import RequestconfirmCode from './components/requestConfirmCode';
import ChangePassword from './components/changePassword';
import { Auth } from 'aws-amplify';

export const Context = createContext(null);
export const Logged = createContext(false);

export default function App(){
    const [user, setUser] = useState('nouser');
    const [logged, setLogged] = useState(false);

    async function iscurrentSession() {
        try {
            await Auth.currentSession();//checks there's a valid user logged and if its session is still valid
            const userdatas = await Auth.currentUserInfo();//gets logged users data
            console.log(userdatas)
            setUser({...userdatas.attributes})
            setLogged(true);
        } catch (error) {
            setUser({})
        }
      }
    useEffect(() => {
        iscurrentSession();
    }, [])

    return(<> 
            <div className="top-background"></div>
            <div className="bottom-background"></div>
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
                            <Route path="/requestcode" element={<RequestconfirmCode/>} />
                            <Route path="/changepassword" element={<ChangePassword />} />
                        </Routes>
                    </Router>
                </Logged.Provider>
            </Context.Provider>
        {/* } */}
        </>
    )
    }
 



