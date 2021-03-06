import './homepage.css'
import { postNewUrl } from '../helpers/mongodb';
import { isSession } from '../helpers/cognito';
import { useContext, useEffect , useState} from 'react';
import  CopyToClipboard  from 'react-copy-to-clipboard';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import {
  ContentCopyRounded
} from "@mui/icons-material";

export default function HomePage() {
  const [user, setUser] = useContext(Context);
  const [logged, setLogged] = useContext(Logged);
  const [viewmodal, setViewmodal] = useState(false);
  const [created, setCreated] = useState(false);
  const [shorturl, setShorturl] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [t] = useTranslation("global");


  const handleNewUrl = async (data)=> {
    const body = {                      
        username: logged? user.username : '',
        url: data.url
    }
    data.url ='';
    await postNewUrl(body) 
    .then ((newData) => {
            setShorturl(newData.data.shorturl);
            setViewmodal(true);
            setCreated(true);
            reset();
        })
        .catch((err) => {
          setViewmodal(true)
        })
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
console.log('rendering')
return (
    
    <div className='container'>
      <main className='main'>
        <h1 className='tittle'>
          Your URL Shortener (YUS)
        </h1>

        {logged ? <p className='description'>{t("shortener.titlelogged")}</p> : 
              <p className='description'>{t("shortener.titleunlogged")}</p>
        }

        <div className='form'>
          <form className='card'onSubmit={handleSubmit(handleNewUrl)}>
            <input type="text" className='input' placeholder='URL' {
              ...register("url",
              {
                defaultValue: "",
                required: { value: true, message: `${t("formserrors.required")}` },
                pattern: { value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, message: `${t("formserrors.wrongformat")}` }
                /* regular expression to check url */
              })} />
                        {errors.url && <div className='form--message-errors'><p>{errors.url.message}</p></div>}
            <input className="login--button login--navigation nbutton" type="submit" value={t("buttons.send")}/>
          </form>
          {viewmodal && <div className="modal confirm-modal">
            <div className="confirm-modal">  {created?             
              <CopyToClipboard text={`https://www.yus.${shorturl}`} onCopy={() => setViewmodal(false)}>
                <div className="confirm-modal"><span className="copy>">
                  {t("modals.shortened")}{`yus.${shorturl}`}</span>
                <ContentCopyRounded className="simple--button"/>
               </div>
              </CopyToClipboard> : 
              <span>{t("modals.alreadyshortened")}</span>}
              <button className="modal-button simple--button" onClick={()=>setViewmodal(false)}>x</button></div>
          </div>}
        </div>
      </main>
    </div>
  );
}