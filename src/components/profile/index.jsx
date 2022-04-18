import './profile.css'
import getUserUrls from '../helpers/getUserUrls';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../App';


import { useForm } from 'react-hook-form';

export default function Profile() {
  const [user, setUser] = useContext(Context);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  console.log(user);
  
  const handleurls = async ()=> {
    await getUserUrls(user.username)
      .then((data)=> {
        console.log(data.data.userurls)
      })
      .catch((error)=> {
        console.log(error)
      })
  }

  const loggedUserJSON = window.localStorage.getItem('userlogged');
  const loggedUser= JSON.parse(loggedUserJSON);
  const userdata = {                      
      username: user.username,
      email: user.email,
      premium: user.premium,
      password: user.password,
  }

  const handleButton = ()=> {
    navigate(`/${userdata.username}/urls`)
  }
 
/*     const loggedUserJSON = window.localStorage.getItem('userlogged');
    const loggedUser= JSON.parse(loggedUserJSON);
    const userdata = {                      
        username: loggedUser.username,
        email: loggedUser.email,
        premium: loggedUser.premium,
        password: loggedUser.password,
    } */
    console.log(userdata.username)
 
  return (
    
    <div className='container'>
      {/* <Header /> */}
      <main className='personal-data'>
        <h1 className='tittle'>
          Mis Datos
        </h1>
        <p>Nombre de usuario: {userdata.username}</p>
        <p>Email: {userdata.email}</p>
        <button onClick={handleButton} >Mis Urls</button>
        <button onClick={()=>navigate('/')} >Recortar Url</button>

      </main>
    </div>
  );
}

