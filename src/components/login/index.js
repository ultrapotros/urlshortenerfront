
import React, { useRef, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useNavigate } from 'react-router-dom';
import postLogin from '../helpers/postLogin';
import md5 from 'md5';

/**
 * Component for the registration of new users
 * @params theme
 * @returns component react
 */
export default function FormLogin() {
    // login or new user discriminator
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ user, setUser ] = useContext(Context);
    const [ logged, setLogged ] = useContext(Logged);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        await postLogin(data.username, md5(data.password))
            .then ((newData) => {
                console.log(newData.status);
                if (newData.status === 200 ) {
                            setUser(newData.data[1]);
                            window.localStorage.setItem('userlogged',JSON.stringify(newData.data[1]));  
                            window.localStorage.setItem('usertoken',JSON.stringify(newData.data[0]));  
                            setLogged(true);
                            navigate('/');
                }
                else if (newData.status === 206) {
                    console.log('usuario o contraseña equivocados')
                }
            })
    };

    // post para ingresar el nuevo usario;

    return (<div className='form--main'>
        <form className='form--login' onSubmit={handleSubmit(onSubmit)} >
            {/* User Name */}
            <input spellCheck="false" className='form--input' type="text" placeholder="Nombre de usuario" {
                ...register("username",
                    {
                        required: { value: true, message: 'Campo requerido' },
                        maxLength: { value: 20, message: 'Tamaño maximo 20' }
                    })} />
                    {errors.username && <div className='login--message-errors'><p>{errors.username.message}</p></div>}

            {/* Password */}
            <input spellCheck="false" className='form--input' type="password" placeholder="Contraseña" {
                ...register("password",
                    {
                        required: { value: true, message: 'Campo requerido' },
                        minLength: { value: 6, message: 'La contraseña tiene que tener al menos 6 caracteres' },
                        maxLength: { value: 20, message: 'Tamaño maximo 20' }
                    })} />
            {errors.password && <div className='login--message-errors'><p >{errors.password.message}</p></div>}

            <input type="submit" className='login--button' />
        </form>
        <button className='login--button login--navigation' onClick={() => navigate('/')}>Volver</button>
    </div>
    );
}