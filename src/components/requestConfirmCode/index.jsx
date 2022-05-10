
import React, { useContext , useState } from 'react';
import { useForm } from 'react-hook-form';
import { sendCode } from '../helpers/cognito';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

/**
 * Component for the registration of new users
 * @params theme
 * @returns component react
 */
export default function RequestconfirmCode() {
    // login or new user discriminator
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ user, setUser ] = useContext(Context);
    const [ logged, setLogged ] = useContext(Logged);
    const [ viewModal, setViewModal ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const navigate = useNavigate();
    const [t] = useTranslation("global");

      async function forgotPassword(user) {
        try {
          await sendCode(user.username);
            console.log('change password code sent');
            navigate('/changepassword')
        } catch (err) {
          console.log('error resending code: ', err);
        }
      }
    const onSubmit = async (data) => {
        forgotPassword(data);
    };

    //FUNCIONA, HAY QUE ARREGLARLO PORQUE AQUI ESTAMOS HACIENDO EL LOGIN POR USERNAME, ES LO QUE HAY QUE PEDIR Y SOLICITAR

    return (<div className='container'>
        <form className='form--login' onSubmit={handleSubmit(onSubmit)} >
            <input spellCheck="false" className='form--input' type="text" placeholder={t("form.username")} {
                ...register("username",
                    {
                        /* required: { value: true, message: `${t("formserrors.required")}` },
                        pattern: { value: /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, message: `${t("formserrors.wrongformat")}`} */
                    })} />
            {errors.username && <div className='form--message-errors'><p >{errors.username.message}</p></div>}

            <input type="submit" className='login--button nbutton' value={t("buttons.send")}/>
        <button className='login--button login--navigation nbutton' onClick={() => navigate('/')}>{t("buttons.back")}</button>
        </form>
    </div>
    );
}