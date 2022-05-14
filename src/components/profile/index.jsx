import './profile.css'
import { useNavigate } from 'react-router-dom';
import { useContext , useEffect } from 'react';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useTranslation } from "react-i18next";
import { isSession } from '../helpers/cognito';

export default function Profile() {
  const [user, setUser] = useContext(Context);
  const [ logged, setLogged ] = useContext(Logged);
  const navigate = useNavigate();
  const [t] = useTranslation("global");
      const handleButton = async () => {
        navigate(`/${user.username}/urls`)
    }
 
  async function iscurrentSession() {
    try {
        const userdatas = await isSession();//gets logged users data if logged
        setUser({username:userdatas.username, email:userdatas.attributes.email})
        setLogged(true);
    } catch (error) {
        setUser({})
    }
  }

  useEffect(() => {
    iscurrentSession();
  }, [])


 
  return (
    
    <div className='container'>
      {/* <Header /> */}
      <main className='personal-data'>
        <h1 className='tittle'>
        {t("personalmain.title")}
        </h1>
        <p>{t("personalmain.name")}: {user.username}</p>
        <p>Email: {user.email}</p>
        <button className="nbutton"onClick={handleButton} >{t("buttons.myurls")}</button>
        <button className="nbutton"onClick={()=>navigate('/')} >{t("buttons.shorturl")}</button>

      </main>
    </div>
  );
}

