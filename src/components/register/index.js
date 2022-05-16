
import React, { useRef, useState , useEffect } from 'react';
import { registerUser , confirmUser } from '../helpers/cognito';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";


export default function FormRegister() { 
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ usertoConfirm, setUsertoConfirm ] = useState();
    const [ confirmModal, setConfirmModal ] = useState(false);
    const [ errorModal, setErrorModal ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(false);
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

    // post to register a new user
    async function signUp(newuser) {
        try {
            const res = await registerUser(newuser);
            if (res === "err") {
                setErrorModal(true);
                setErrorMessage(t("modals.user_exists"))
            }
            else if (res === 'success'){
                setUsertoConfirm(newuser.username);
                setConfirmModal(true);
            }
            else {
                setErrorModal(true);
                setErrorMessage(t("modals.somewrong"))
            }
        } catch (error) {
            setErrorModal(true);
            setErrorMessage(t("modals.somewrong"))
        }
      }

    async function confirmSignUp() { //function to send cofimration code
        try {
            const res = await confirmUser(usertoConfirm, code.current.value);
            if (res === "wrong code") { //getting wrong code error
                setErrorModal(true)
                setErrorMessage(t("modals.wrongcode"))
            }
            else {
                navigate(`/login`)   
            }
          } catch (error) { //getting any other problem
            setErrorModal(true);
            setErrorMessage(t("modals.somewrong"))
          }
    }

    useEffect(() => {
      }, [])

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

            <input type="submit" className='simple--button' value= {t("buttons.send")}/>
        </form>
        <button className='login--button nbutton' onClick={() => navigate('/')}>{t("buttons.back")}</button>

        {/* modal to introduce confirmation code */}
        {confirmModal && 
            <div className="registermodals">
                <label className="modals-text">{t("modals.confirmation_code")}</label>
                <input type="text" className="form-control" placeholder={t("form.confirmation_code")} ref ={code}/>
                <button type="button" className="simple--button" onClick={confirmSignUp}>{t("buttons.send")}</button>
            </div>}

        {/* modal to show errors */}
        {errorModal && 
            <div className="errors-modal">
                <span className="modals-text">{errorMessage}</span>
                <button type="button" className="form-button simple--button" onClick={(()=>setErrorModal(false))}>{t("buttons.close")}</button>
            </div>}
    </div>
    );
}