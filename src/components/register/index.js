
import React, { useRef, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useNavigate } from 'react-router-dom';
import postNewUser from '../helpers/postNewUser';
import postLogin from '../helpers/postLogin';
import md5 from 'md5';
import axios from "axios";

/**
 * Component for the registration of new users
 * @params theme
 * @returns component react
 */
export default function FormRegister(props) {
    // login or new user discriminator
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ user, setUser ] = useContext(Context);
    const [ logged, setLogged ] = useContext(Logged);
    const navigate = useNavigate();
    const password = useRef({}); // to compare and confirm password and email
    password.current = watch("password", "");
    const email = useRef({});
    email.current = watch("email", "");
    let userData = { username: '', premium:false, password: '', email: '' };
    const onSubmit = async (data) => {
        userData.username = data.username;
        userData.password = md5(data.password);
        userData.email = data.email
        await postNewUser(userData)
            .then ((newData) => {
                console.log(newData.status);
                if (newData.status === 200 ) {
                    postLogin(userData.username, userData.password)
                    .then((response) => {
                            setUser(newData.data.usuario);
                            console.log(response.data[1]);
                            const usertolocal = {...response.data[1]}
                            console.log(usertolocal);
                            window.localStorage.setItem('userlogged',JSON.stringify(usertolocal));  
                            setLogged(true);
                            navigate('/');
                        })
                }

            })
/*         await axios({
            method: 'post',
            url: 'https://enterprisecompany-server.herokuapp.com/v1/users/create',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
            }
        }).then((res) => {
            if (res.status === 201) {
                console.log('j');
                }
            } 
        ) */
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
            {/* Email */}
            <input spellCheck="false" className='form--input' type="text" placeholder="Email" {
                ...register("email",
                    {
                        required: { value: true, message: 'Campo requerido' },
                        pattern: { value: /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, message: 'Formato no correcto' }
                    })} />
            {errors.email && <div className='login--message-errors'><p >{errors.email.message}</p></div>}
            {/* Repeat Email */}
            <input spellCheck="false" className='form--input' type="text" placeholder="Email" {
                ...register("emailrepeated",
                    {
                        required: { value: true, message: 'Campo requerido' },
                        validate: value =>
                        value === email.current || "los emails no coinciden"
                    })} />
            {errors.emailrepeated && <div className='login--message-errors'><p >{errors.emailrepeated.message}</p></div>}

            {/* Password */}
            <input spellCheck="false" className='form--input' type="password" placeholder="Contraseña" {
                ...register("password",
                    {
                        required: { value: true, message: 'Campo requerido' },
                        minLength: { value: 6, message: 'La contraseña tiene que tener al menos 6 caracteres' },
                        maxLength: { value: 20, message: 'Tamaño maximo 20' }
                    })} />
            {errors.password && <div className='login--message-errors'><p >{errors.password.message}</p></div>}
            {/* Password Repeat*/}

            <input spellCheck="false" className='form--input' type="password" placeholder="Repite contraseña" {
                ...register("passwordRepeat",
                    {
                        required: { value: true, message: 'Campo requerido' },
                        validate: value =>
                            value === password.current || "las contraseñas no coinciden"
                    })} />
            {errors.passwordRepeat && <div className='login--message-errors'><p >{errors.passwordRepeat.message}</p></div>}

            <input type="submit" className='login--button' />
        </form>
        <button className='login--button login--navigation' onClick={() => navigate('/')}>Volver</button>
    </div>
    );
}