
import React, { useContext , useState , useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { loginUser } from '../helpers/cognito';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import './login.css';
import { Auth } from 'aws-amplify';

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
    const [ errorMessage, setErrorMessage ] = useState();
    const navigate = useNavigate();
    const [t,i18n] = useTranslation("global");

    async function signIn(data) {//si la contraseña es erronea devuelve un 400
        try {
          const userlogged  = await loginUser(data.username, data.password);
          if (userlogged.username) {
            setUser({username:userlogged.username, email:userlogged.attributes.email});
            setLogged(true);//esto hace renderizar el header
            const userlang = {...userlogged.attributes}
            i18n.changeLanguage(userlang["custom:language"])
            navigate(`/${userlogged.username}/profile`)              
          }
          else {
              setErrorMessage(t(`modals.${userlogged}`))
              setViewModal(true)
          }

        } catch (error) {
            setErrorMessage(t(`modals.somewrong`))
            setViewModal(true)
        }
      }

    const onSubmit = async (data) => {
        signIn(data);
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

            <input type="submit" className='simple--button' value={t("buttons.send")}/>
            <p className='forgotten-password simple--button' onClick={() => navigate('/requestcode')}>{t("form.forgotten_password")}</p>
        <button className='login--button login--navigation nbutton' onClick={() => navigate('/')}>{t("buttons.back")}</button>
        </form>
        {viewModal && <div className="login-modal">
            <span className="login-modal--message">{errorMessage}</span>
            <div onClick={()=>setViewModal(false)} className="login-modal--close">x</div>
        </div>}
    </div>
    );
}