import './profile.css'
import getUserUrls from '../helpers/getUserUrls';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../App';
import { useTranslation } from "react-i18next";

import { useForm } from 'react-hook-form';

export default function Profile() {
  const [user, setUser] = useContext(Context);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [t] = useTranslation("global");
  
/*   const handleurls = async ()=> {
    await getUserUrls(user.user.username,loggedUser)
      .then((data)=> {
        console.log(data.data.userurls)
      })
      .catch((error)=> {
        console.log(error)
      })
  }
 */
/*   const loggedUserJSON = window.localStorage.getItem('usertoken');
  const loggedUser= JSON.parse(loggedUserJSON);
  console.log(loggedUser) */

  const userdata = {                      
      username: user.user.username,
      email: user.user.email,
      premium: user.user.premium,
      password: user.user.password,
  }

  const handleButton = ()=> {
    navigate(`/${userdata.username}/urls`)
  }
 
  return (
    
    <div className='container'>
      {/* <Header /> */}
      <main className='personal-data'>
        <h1 className='tittle'>
        {t("personalmain.title")}
        </h1>
        <p>{t("personalmain.name")}: {userdata.username}</p>
        <p>Email: {userdata.email}</p>
        <button className="nbutton"onClick={handleButton} >{t("buttons.myurls")}</button>
        <button className="nbutton"onClick={()=>navigate('/')} >{t("buttons.shorturl")}</button>

      </main>
    </div>
  );
}

