
import React, { useRef, useContext , useState , useEffect } from 'react';
import { registerUser , confirmUser } from '../helpers/cognito';
import { useForm } from 'react-hook-form';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

/**
 * Component for the registration of new users
 * @params theme
 * @returns component react
 */
export default function FormRegister(props) { //AQUI TENDRIA QUE HACER UN MODAL PARA INTRODUCIR EL CODIGO DE VALIDACION
    // login or new user discriminator
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ user, setUser ] = useContext(Context);
    const [ usertoConfirm, setUsertoConfirm ] = useState();
    const [ confirmModal, setConfirmModal ] = useState(false);
    const [ errorModal, setErrorModal ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(false);
    const [ logged, setLogged ] = useContext(Logged);
    const navigate = useNavigate();
    const [t] = useTranslation("global");
    const password = useRef({}); // to compare and confirm password and email
    password.current = watch("password", "");
    const email = useRef({});
    const code = useRef({});
    email.current = watch("email", "");
    const onSubmit = async (data) => {
        signUp(data);
    };

    // post para ingresar el nuevo usario;
    async function signUp(newuser) {
        try {
            const res = await registerUser(newuser);
            if (res == "err") {
                setErrorModal(true);
                setErrorMessage(t("modals.user_exists"))
            }
            else {
                setUsertoConfirm(newuser.username);
                setConfirmModal(true);
            }
        } catch (error) {
            console.log('error signing up:', error);
        }
      }

    async function confirmSignUp() {
        try {
            const res = await confirmUser(usertoConfirm, code.current.value);
            if (res == "wrong code") {
                setErrorModal(true)
                setErrorMessage(t("modals.wrongcode"))
            }
            else {
                navigate(`/login`)   
            }
          } catch (error) { //here it should not enter ever 
              console.log('error confirming sign up', error);
          }
    }

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
                        pattern: { value: /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, message: `${t("formserrors.wrongformat")}`}
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

            {/* language*/}            
            <select className='form--input' placeholder={t("form.language")} {
                ...register("language", {
                    required: { value: true, message: `${t("formserrors.required")}` }
                })}>
                <option value='es'>{t("form.language_es")}</option>
                <option value='en'>{t("form.language_en")}</option>
            </select>                     
            {errors.language && <div className='form--message-errors'><p>{errors.language.message}</p></div>}

            <input type="submit" className='login--button' value= {t("buttons.send")}/>
        </form>
        <button className='login--button login--navigation' onClick={() => navigate('/')}>{t("buttons.back")}</button>
        {confirmModal && 
            <div className="registermodals">
                <label className="modals-text">{t("modals.confirmation_code")}</label>
                <input type="text" className="form-control" placeholder={t("form.confirmation_code")} ref ={code}/>
                <button type="button" className="form-button" onClick={confirmSignUp}>{t("buttons.send")}</button>
            </div>}
        {errorModal && 
            <div className="registermodals">
                <label className="modals-text">{errorMessage}</label>
                <button type="button" className="form-button" onClick={(()=>setErrorModal(false))}>{t("buttons.close")}</button>
            </div>}
    </div>
    );
}