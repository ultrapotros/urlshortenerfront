import { isSession } from '../helpers/cognito';
import { deleteUrl , modifyUrl , getUrls} from '../helpers/mongodb';
import { useContext , useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useForm } from 'react-hook-form';
import  CopyToClipboard  from 'react-copy-to-clipboard';
import {
  SettingsOutlined,
  DeleteOutlined,
  ContentCopyRounded
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import './urlslist.css';

export default function Urls() {
    const [t] = useTranslation("global");
    const [user, setUser] = useContext(Context);
    const [logged, setLogged] = useContext(Context);
    const [urls, setUrls] = useState([{url:t("urlslist.nourls"),shorturl:"",clicksCounter:""}]);
    const [isurls,setIsurls] = useState(false);
    const [errorModal,setErrorModal] = useState(false);
    const [confirmModal,setConfirmModal] = useState(false);
    const [modify,setModify] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [confirmMessage, setConfirmMessage] = useState();
    const [urlindex,setUrlindex] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
 
    const handleButton = ()=> {
        navigate(`/${user.username}/profile`)
    }

    const handleUrls = async () => {
      try {
        const data = await getUrls()
        if (data.data.userurls.length > 0) {
          setUrls(data.data.userurls) 
        } 
        setIsurls(true)
      }
      catch (err) {
        setIsurls(false)}
    }
      
    const handleModify = async (i)=> {
      setUrlindex(i);
      setModify(!modify);
    }
  
    const handleDelete = async (id)=> {
      const body = {"_id":urls[id]._id}
      await deleteUrl(body).then(()=>{
        setConfirmMessage(t("modals.deleted"))
        setConfirmModal(true)
      })
      await handleUrls()
      .catch(()=>{
        setErrorMessage(t("modals.somewrong"))
      })
    }
    const handleCopy = ()=> {
      setConfirmMessage(t("modals.copied"))
      setConfirmModal(true)
    }

    const onSubmit = async (data) => {
      try{
          const res = await modifyUrl(urls[urlindex]._id, data.newurl )
          if (res === "Already exists") {
            setErrorMessage(t("modals.short-exists"));
            setErrorModal(true);
          }
          else if (res === "updated") {
            setModify(false);
            setConfirmMessage(t("modals.short-modified"));
            setConfirmModal(true);
          }
          else {
            setErrorMessage(t("modals.wrongcode"))
          }
          await handleUrls();

      }
      catch {
            setErrorMessage(t("modals.somewrong"))
      }
    };

    async function iscurrentSession() {
      try {
          const userdatas = await isSession();//gets logged users data if logged
          if (user.username!== userdatas.username) {
            setUser({username:userdatas.username, email:userdatas.attributes.email});
          }
          setLogged(true);
          await handleUrls();
      } catch (error) {
          setUser({})
      }
    }

    useEffect(async () => {
      await iscurrentSession();
    }, [])  
    
    return (
    
      <div className='container'>
      <h1 className='urls-main--title'>{t("urlslist.title")}</h1>
      <main className='personal-urls'>
        {isurls? <div className='long-urls'>
          <div className='personal-urls--titles'>
              <h3 className='title-b'> {t("urlslist.longurls")}</h3>
              <h3 className='title-b'> {t("urlslist.shorturls")}</h3>
              <h3 className='title-b'> {t("urlslist.clicks")}</h3>
              <h3 className='title-b'></h3>
          </div>
            <ul className='urls-list'>
                {urls.map((element, index)=> 
                  <li key={index} className='urls-list-row'>
                    <div className='urls-list-column url'>{element.url}</div> 
                    {/* once deployed you only have to change text parameter */}
                    <CopyToClipboard /* text={`https://www.yus.${element.shorturl}`} */ text={`https://localhost:3000/${element.shorturl}`} onCopy={handleCopy}><div className='urls-list-column short_url'>
                    {`yus.${element.shorturl}`} <ContentCopyRounded className='simple--button'/></div>
                    </CopyToClipboard>
                   
                    <div className='urls-list-column'>{element.clicksCounter}</div>
                    <div className='urls-list-buttons'>
                      <SettingsOutlined className='simple--button' onClick={()=>handleModify(index)}/>
                      <DeleteOutlined className='simple--button' onClick={()=>handleDelete(index)}/>
                    </div>
                  </li>)}
            </ul>
        </div> : <h3>Charging...</h3>}
      </main>
      <button className="nbutton" onClick={handleButton} >{t("buttons.back")}</button>
      {errorModal && <div className="errors-modal"><span className="modal-text">{errorMessage}</span><button className="modal-button simple--button"onClick={()=>setErrorModal(!errorModal)} >x</button></div>}
      {confirmModal && <div className="confirm-modal"><span className="modal-text">{confirmMessage}</span><button className="modal-button simple--button"onClick={()=>setConfirmModal(!confirmModal)} >x</button></div>}
      
      {/* modal to customize shorturl */}
      {modify && <form className='form--login modal' onSubmit={handleSubmit(onSubmit)} >
            {/* Original Url */}
            <input spellCheck="false" className='form--input' type="text" value={urls[urlindex].url} disabled{
                ...register("url")} />
            {/* Current Short Urls: */}
            <input spellCheck="false" className='form--input' type="text" value={urls[urlindex].shorturl} disabled{
                ...register("shorturl")} />
                  

            {/* New Short Url */}
            <input spellCheck="false" className='form--input' type="text" placeholder={t("form.modify")} {
                ...register("newurl",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        minLength: { value: 4, message: `${t("formserrors.minlegth")}4`},
                        maxLength: { value: 8, message: `${t("formserrors.maxlength")}8` }
                    })} />
            {errors.newurl && <div className='form--message-errors'><p >{errors.newurl.message}</p></div>}

            <input type="submit" className='modify--button simple--button' value={t("buttons.send")}/>
        </form>}
    </div>
  );
}
