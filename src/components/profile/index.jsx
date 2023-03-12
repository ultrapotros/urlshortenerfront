import './profile.css'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../App';
import { useTranslation } from "react-i18next";


export default function Profile() {
  const [user] = useContext(Context);
  const navigate = useNavigate();
  const [t] = useTranslation("global");

  const userdata = {
    username: user.user.username,
    email: user.user.email,
    premium: user.user.premium,
    password: user.user.password,
  }

  const handleButton = () => {
    navigate(`/urls/${userdata.username}`)
  }

  return (

    <div className='container'>
      <main className='personal-data'>
        <h1 className='tittle'>
          {t("personalmain.title")}
        </h1>
        <p>{t("personalmain.name")}: {userdata.username}</p>
        <p>Email: {userdata.email}</p>
        <button className="nbutton" onClick={handleButton} >{t("buttons.myurls")}</button>
        <button className="nbutton" onClick={() => navigate('/')} >{t("buttons.shorturl")}</button>

      </main>
    </div>
  );
}

