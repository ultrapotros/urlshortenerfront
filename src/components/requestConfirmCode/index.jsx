
import React, {  useState } from 'react';
import { useForm } from 'react-hook-form';
import { sendCode } from '../helpers/cognito';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";


export default function RequestconfirmCode() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ errorModal, setErrorModal ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const navigate = useNavigate();
    const [t] = useTranslation("global");

      async function forgotPassword(user) {
        try {
          const result = await sendCode(user.username);
          typeof(result)==="string"? setErrorMessage(t(`modals.${result}`)):
            navigate('/changepassword');
        } catch (err) {
            setErrorMessage(t("modals.wrongcode"));
          }
        setErrorModal(true);
      }
    const onSubmit = async (data) => {
        forgotPassword(data);
    };

    return (<div className='container'>
        <form className='form--login' onSubmit={handleSubmit(onSubmit)} >
            <input spellCheck="false" className='form--input' type="text" placeholder={t("form.username")} {
                ...register("username",
                    {
                      required: { value: true, message: `${t("formserrors.required")}` },
                      maxLength: { value: 20, message: `${t("formserrors.maxlength")}20` }
                    })} />
            {errors.username && <div className='form--message-errors'><p >{errors.username.message}</p></div>}

            <input type="submit" className='simple--button' value={t("buttons.send")}/>
        <button className='login--button login--navigation nbutton' onClick={() => navigate('/')}>{t("buttons.back")}</button>
        </form>
        {errorModal && 
        <div className="errors-modal">
            <label className="modals-text">{errorMessage}</label>
            <button type="button" className="modal-button simple--button" onClick={(()=>setErrorModal(false))}>x</button>
        </div>}
    </div>
    );
}