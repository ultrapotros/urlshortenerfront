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
    const [modal,setModal] = useState(false);
    const [modify,setModify] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [urlindex,setUrlindex] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
 
    const handleButton = ()=> {
        navigate(`/${user.username}/profile`)
    }

    const handleUrls = async () => {
      try {
        const data = await getUrls(user.username)
        console.log(data)
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
    
    const handleModal = ()=> {
        setModal(false)
    }

    const handleDelete = async (id)=> {
      const body = {"_id":urls[id]._id}
      await deleteUrl(body).then(()=>{
        setErrorMessage(t("modals.deleted"))
        setModal(true)
      })
      .catch(()=>{
        setErrorMessage(t("modals.somewrong"))
      })
    }
    const handleCopy = ()=> {
      setErrorMessage(t("modals.copied"))
      setModal(true)
    }

    const onSubmit = async (data) => {
      try{
          const res = await modifyUrl(urls[urlindex]._id, data.newurl )
          if (res === "Already exists") {
            setErrorMessage(t("modals.short-exists"));
            setModal(true);
          }
          else if (res === "updated") {
            console.log('success')
              setModify(false);
              setErrorMessage(t("modals.short-modified"));
              setModal(true);
          }
          else {
            setErrorMessage(t("modals.wrongcode"))
          }

      }
      catch {
            setErrorMessage(t("modals.somewrong"))
      }
    };

    async function iscurrentSession() {
      try {
          const userdatas = await isSession();//gets logged users data if logged
          setUser({username:userdatas.username, email:userdatas.attributes.email})
          setLogged(true);
      } catch (error) {
          setUser({})
      }
      handleUrls();
    }

    useEffect(async () => {
      console.log('effect-1')
      await iscurrentSession();
    }, [])  
    
    useEffect(() => {
     console.log('effect-2')
      const rendering = async()=> {
        console.log('effect-3')
        await handleUrls();
      }
      rendering()
    }, [modal])  
    
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
                    <CopyToClipboard text={element.shorturl} onCopy={handleCopy}><div className='urls-list-column short_url'>
                    {element.shorturl} <ContentCopyRounded className='simple--button'/></div>
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
      {modal && <div className="modal"><p className="modal-text">{errorMessage}</p><button onClick={handleModal} >x</button></div>}
      
      {/* modal to customize shorturl */}
      {modify && <form className='form--login' onSubmit={handleSubmit(onSubmit)} >
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
