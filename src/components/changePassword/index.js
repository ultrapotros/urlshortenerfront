
import React, { useState ,useRef } from 'react';
import { useForm } from 'react-hook-form';
import { changePassword } from '../helpers/cognito';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";


export default function ChangePassword() {
    // login or new user discriminator
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ errorModal, setErrorModal ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const password = useRef({}); // to compare and confirm password and email
    password.current = watch("password", "");
    const navigate = useNavigate();
    const [t] = useTranslation("global");

      async function handlePassword(data) {
        try {
          const result = await changePassword(data);
          if (result==='SUCCESS') {
              navigate('/login')
          }  
          setErrorMessage(t(`modals.${result}`));
          setErrorModal(true);
            
        } catch {
            setErrorMessage(t("modals.wrongcode"));
            setErrorModal(true);
        }
      }
    const onSubmit = async (data) => {
        await handlePassword(data);
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
        
        {/* Password */}
        <input spellCheck="false" className='form--input' type="password" placeholder={t("form.newpassword")} {
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
        {/* Code */}
        <input spellCheck="false" className='form--input' type="text" placeholder={t("form.confirmation_code")} {
            ...register("code",
                {
                    required: { value: true, message: `${t("formserrors.required")}` },
                    maxLength: { value: 7, message: `${t("formserrors.maxlength")}7` }
                })} />
                {errors.code && <div className='form--message-errors'><p>{errors.code.message}</p></div>}

        <input type="submit" className='simple--button' value= {t("buttons.send")}/>
    </form>
    <button className='login--button login--navigation nbutton' onClick={() => navigate('/')}>{t("buttons.back")}</button>
{/*     {confirmModal && 
        <div className="registermodals">
            <label className="modals-text">{t("modals.confirmation_code")}</label>
            <input type="text" className="form-control" placeholder={t("form.confirmation_code")} ref ={code}/>
            <button type="button" className="form-button" onClick={confirmSignUp}>{t("buttons.send")}</button>
        </div>} */}
    {errorModal && 
        <div className="errors-modal">
            <span className="modals-text">{errorMessage}</span>
            <button type="button" className="form-button simple--button" onClick={(()=>setErrorModal(false))}>{t("buttons.close")}</button>
        </div>}
</div>
    );
}