
import React, { useContext , useState ,useRef } from 'react';
import { useForm } from 'react-hook-form';
import { changePassword } from '../helpers/cognito';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

/**
 * Component for the registration of new users
 * @params theme
 * @returns component react
 */
export default function ChangePassword() {
    // login or new user discriminator
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ user, setUser ] = useContext(Context);
    const [ logged, setLogged ] = useContext(Logged);
    const [ viewModal, setViewModal ] = useState(false);
    const [ errorModal, setErrorModal ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const password = useRef({}); // to compare and confirm password and email
    password.current = watch("password", "");
    const navigate = useNavigate();
    const [t] = useTranslation("global");

      async function handlePassword(data) {
        try {
          await changePassword(data);
            console.log('change password code sent');
            navigate('/login')
        } catch (err) {
          console.log('error resending code: ', err);
        }
      }
    const onSubmit = async (data) => {
        handlePassword(data);
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

        <input type="submit" className='login--button' value= {t("buttons.send")}/>
    </form>
    <button className='login--button login--navigation' onClick={() => navigate('/')}>{t("buttons.back")}</button>
{/*     {confirmModal && 
        <div className="registermodals">
            <label className="modals-text">{t("modals.confirmation_code")}</label>
            <input type="text" className="form-control" placeholder={t("form.confirmation_code")} ref ={code}/>
            <button type="button" className="form-button" onClick={confirmSignUp}>{t("buttons.send")}</button>
        </div>} */}
    {errorModal && 
        <div className="registermodals">
            <label className="modals-text">{errorMessage}</label>
            <button type="button" className="form-button" onClick={(()=>setErrorModal(false))}>{t("buttons.close")}</button>
        </div>}
</div>
    );
}