
import React, { useRef, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useNavigate } from 'react-router-dom';
import postNewUser from '../helpers/postNewUser';
import postLogin from '../helpers/postLogin';
import { useTranslation } from "react-i18next";
import md5 from 'md5';
import axios from "axios";

/**
 * Component for the registration of new users
 * @params theme
 * @returns component react
 */
export default function FormRegister(props) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [user, setUser] = useContext(Context);
    const [logged, setLogged] = useContext(Logged);
    const navigate = useNavigate();
    const [t] = useTranslation("global");
    const password = useRef({}); // to compare and confirm password and email
    password.current = watch("password", "");
    const email = useRef({});
    email.current = watch("email", "");
    let userData = { username: '', premium: false, password: '', email: '' };
    const onSubmit = async (data) => {
        userData.username = data.username;
        userData.password = md5(data.password);
        userData.email = data.email
        await postNewUser(userData)

            .then((newData) => {

                if (newData.data.message === 'Email already registered') {
                    alert('Email already registered');
                    return;
                }
                if (newData.data.message === 'User already exists') {
                    alert('User already exists');
                    return;
                }
                if (newData.status === 200) {
                    postLogin(userData.username, userData.password)
                        .then((newData) => {
                            const userContext = { user: newData.data[1], token: newData.data[0] }
                            setUser(userContext);
                            window.localStorage.setItem('userlogged', JSON.stringify(newData.data[1]));
                            window.localStorage.setItem('usertoken', JSON.stringify(newData.data[0]));
                            setLogged(true);
                            navigate('/');
                        })
                }

            })

    };


    return (<div className='container'>
        <form className='form--login' onSubmit={handleSubmit(onSubmit)} >
            {/* User Name */}
            <input spellCheck="false" className='form--input' type="text" placeholder={t("form.username")} {
                ...register("username",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        maxLength: { value: 20, message: `${t("formserrors.maxlength")}20` }
                    })} />
            {errors.username && <div className='form--message-errors'><p>{errors.username.message}</p></div>}
            {/* Email */}
            <input spellCheck="false" className='form--input' type="text" placeholder="Email" {
                ...register("email",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        pattern: { value: /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, message: `${t("formserrors.wrongformat")}` }
                    })} />
            {errors.email && <div className='form--message-errors'><p >{errors.email.message}</p></div>}
            {/* Repeat Email */}
            <input spellCheck="false" className='form--input' type="text" placeholder={t("form.emailcheck")} {
                ...register("emailrepeated",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        validate: value =>
                            value === email.current || `${t("formserrors.emailnotmatch")}`
                    })} />
            {errors.emailrepeated && <div className='form--message-errors'><p >{errors.emailrepeated.message}</p></div>}

            {/* Password */}
            <input spellCheck="false" className='form--input' type="password" placeholder={t("form.password")} {
                ...register("password",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        minLength: { value: 4, message: `${t("formserrors.minlength")}4` },
                        maxLength: { value: 20, message: `${t("formserrors.maxlength")}20` }
                    })} />
            {errors.password && <div className='form--message-errors'><p >{errors.password.message}</p></div>}
            {/* Password Repeat*/}

            <input spellCheck="false" className='form--input' type="password" placeholder={t("form.passwordcheck")} {
                ...register("passwordRepeat",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        validate: value =>
                            value === password.current || `${t("formserrors.passwordnotmatch")}`
                    })} />
            {errors.passwordRepeat && <div className='form--message-errors'><p >{errors.passwordRepeat.message}</p></div>}

            <input type="submit" className='login--button' value={t("buttons.send")} />
        </form>
        <button className='login--button login--navigation' onClick={() => navigate('/')}>{t("buttons.back")}</button>
    </div>
    );
}