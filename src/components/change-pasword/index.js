
import React, { useContext , useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import postLogin from '../helpers/postLogin';
import { useTranslation } from "react-i18next";
import md5 from 'md5';
import './change-password.css';
import resetPassword from '../helpers/resetPassword';

/**
 * Component for the registration of new users
 * @params theme
 * @returns component react
 */
export default function ChangePassword() {
    // login or new user discriminator
    const { token }= useParams();
    const { register, handleSubmit, watch, clearErrors, formState: { errors } } = useForm();
    const [ user, setUser ] = useContext(Context);
    const [ logged, setLogged ] = useContext(Logged);
    const [ viewModal, setViewModal ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const password = useRef({});
    password.current = watch("password", "");
    const navigate = useNavigate();
    const [t] = useTranslation("global");

    const onSubmit = async (data) => {

        console.log(data.password)
        console.log(token)
        const response = await resetPassword(data.password, token)
        console.log(response)



    };


    return (<div className='container'>
        <form className='form--login' onSubmit={handleSubmit(onSubmit)} >
            {/* User Name */}
            <input spellCheck="false" className='form--input' type="password" placeholder={t("form.password")} {
                ...register("password",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        minLength: { value: 4, message: `${t("formserrors.minlength")}4` },
                        maxLength: { value: 20, message: `${t("formserrors.maxlength")}20` }
                    })} />
            {errors.password && <button onClick={()=>clearErrors()} > <div className='form--message-errors'><p >{errors.password.message}</p></div></button>}
            {/* Password Repeat*/}

            <input spellCheck="false" className='form--input' type="password" placeholder={t("form.passwordcheck")} {
                ...register("passwordRepeat",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        validate: value =>
                            value === password.current || `${t("formserrors.passwordnotmatch")}`
                    })} />
            {errors.passwordRepeat &&  <button onClick={()=>clearErrors()} > <div className='form--message-errors'><p >{errors.passwordRepeat.message}</p></div></button> }

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