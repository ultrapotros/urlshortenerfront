
import React, { useContext , useState } from 'react';
import { useForm } from 'react-hook-form';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useNavigate } from 'react-router-dom';
import postLogin from '../helpers/postLogin';
import { useTranslation } from "react-i18next";
import md5 from 'md5';
import './login.css';

/**
 * Component for the registration of new users
 * @params theme
 * @returns component react
 */
export default function FormLogin() {
    // login or new user discriminator
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ user, setUser ] = useContext(Context);
    const [ logged, setLogged ] = useContext(Logged);
    const [ viewModal, setViewModal ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const navigate = useNavigate();
    const [t] = useTranslation("global");

    const onSubmit = async (data) => {
        await postLogin(data.username, md5(data.password))
            .then ((newData) => {

                if (newData.status === 200 ) {
                    const userContext = {user:newData.data[1], token:newData.data[0]}
                    setUser(userContext);
                    window.localStorage.setItem('userlogged',JSON.stringify(newData.data[1]));  
                    window.localStorage.setItem('usertoken',JSON.stringify(newData.data[0]));  
                    setLogged(true);
                    navigate('/');
                }
                else if (newData.status === 206) {
                    setViewModal(true)
                    if (newData.data.nouser) {
                        setErrorMessage(t("modals.nouser"))
                    }
                    else {
                        setErrorMessage(t("modals.wrongpassword"))
                    }
                }
            })
    };

    return (<div className='container'>
        <form className='form--login' onSubmit={handleSubmit(onSubmit)} >
            {/* User Name */}
            <input spellCheck="false" className='form--input' type="text" placeholder={t("form.username")}{
                ...register("username",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        maxLength: { value: 20, message: `${t("formserrors.maxlength")}20` }
                    })} />
                    {errors.username && <div className='form--message-errors'><p>{errors.username.message}</p></div>}

            {/* Password */}
            <input spellCheck="false" className='form--input' type="password" placeholder={t("form.password")} {
                ...register("password",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        minLength: { value: 4, message: `${t("formserrors.minlength")}4` },
                        maxLength: { value: 20, message: `${t("formserrors.maxlength")}20` }
                    })} />
            {errors.password && <div className='form--message-errors'><p >{errors.password.message}</p></div>}

            <input type="submit" className='login--button nbutton' value={t("buttons.send")}/>
        <button className='login--button login--navigation nbutton' onClick={() => navigate('/')}>{t("buttons.back")}</button>
        </form>
        {viewModal && <div className="login-modal">
            <span className="login-modal--message">{errorMessage}</span>
            <div onClick={()=>setViewModal(false)} className="login-modal--close">x</div>
        </div>}
    </div>
    );
}