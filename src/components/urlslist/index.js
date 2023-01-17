import getUserUrls from '../helpers/getUserUrls';
import deleteUrl from '../helpers/deleteUrl';
import modifyUrl from '../helpers/modifyurl';
import { useContext , useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import  CopyToClipboard  from 'react-copy-to-clipboard';
import {
  SettingsOutlined,
  DeleteOutlined,
  ContentCopyRounded
} from "@mui/icons-material";
import './urlslist.css';

export default function Urls() {
  const [user, setUser] = useContext(Context);
  const [urls, setUrls] = useState();
  const [isurls,setIsurls] = useState(false);
  const [modal,setModal] = useState(false);
  const [errorModal,setErrorModal] = useState(false);
  const [confirmModal,setConfirmModal] = useState(false);
  const [modify,setModify] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [confirmMessage, setConfirmMessage] = useState();
  const [urlindex,setUrlindex] = useState();
  const [t] = useTranslation("global");
  const { register, handleSubmit, formState: { errors }, clearErrors } = useForm();
  const navigate = useNavigate();
 
 
    const handleButton = ()=> {
        navigate(`/profile/${user.user.username}`)
    }

    const handleUrls = async () => {
      await getUserUrls(user.user.username,user.token)
      .then((data)=> {
          setUrls(data.data.userurls)
          setIsurls(true)
        })   
        .catch((error) => {
          console.log(error)
          setIsurls(false)
        })   
    }

    const handleCopy = ()=> {
      setConfirmMessage(t("modals.copied"))
      setConfirmModal(true)
    }

    useEffect(() => {
        
        handleUrls();
    }, [])

/*     const handleModify = async (i)=> {
      setUrlindex(i);
      setModify(true);
    }
       */
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
/*     const handleCopy = ()=> {
      setConfirmMessage(t("modals.copied"))
      setConfirmModal(true)
    } */

/*     const handleDelete = async (id)=> {
      const body = {"id":id}
      await deleteUrl(body,user.token).then(()=>{
        setModal(true)
        handleUrls();
      })
      .catch((err)=>{
        console.log(err)
      })
    } */


  const onSubmit = async (data) => {

    try{
        const res = await modifyUrl(urls[urlindex]._id, data.newurl, user.token )
        if (res.data.message === "Already exists") {
          setErrorMessage(t("modals.short-exists"));
          setErrorModal(true);

        }
        else if (res.data.message === "updated") {
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
          setErrorMessage(t("modals.somewrong"));
          setErrorModal(true);
    }
  };

    
    return (
    
      <div className='container'>
      <h1 className='urls-main--title'>{t("urlslist.title")}</h1>
      <main className='personal-urls'>
        {isurls? 
          <div className='long-urls'>
            {urls.length > 0 ?  
            <div className='personal-urls--titles'>
                <h3 className='title-b'> {t("urlslist.longurls")}</h3>
                <h3 className='title-b'> {t("urlslist.shorturls")}</h3>
                <h3 className='title-b'> {t("urlslist.clicks")}</h3>
                <h3 className='title-b'></h3>
            </div>:
            <h3 className='title-b'> {t("urlslist.nourls")}</h3>         
            }
              <ul className='urls-list'>
                  {urls.map((element, index)=> 
                    <li key={index} className='urls-list-row'>
                      <div className='urls-list-column url'>{element.url}</div> 
                      {/* once deployed you only have to change text parameter */}
                      <div className='urls-list-column short_url'>
                        <p>{`yus.${element.shorturl}`}</p>   
                        <div  className='simple--button'>
                          <CopyToClipboard text={`http://localhost:3000/${element.shorturl}`} onCopy={handleCopy}>
                            <ContentCopyRounded/>
                          </CopyToClipboard>
                        </div>
                      </div>
                      <div className='urls-list-column'>{element.clicksCounter}</div>
                      <div className='urls-list-buttons'>
                        <div className='simple--button' ><SettingsOutlined onClick={()=>handleModify(index)}/></div>
                        <div className='simple--button' ><DeleteOutlined onClick={()=>handleDelete(element._id)}/></div>
                      </div>
                    </li>)}
              </ul>
          </div> : 
          <h3>Charging...</h3>}
      </main>
      <button className="nbutton" onClick={handleButton} >{t("buttons.back")}</button>
      {errorModal && 
      <div className="errors-modal modal">
        <span className="modal-text">{errorMessage}</span>
        <button className="modal-button simple--button"onClick={()=>setErrorModal(!errorModal)} >x</button>
      </div>}
      {confirmModal && 
      <div className="confirm-modal modal">
        <span className="modal-text">{confirmMessage}</span>
        <button className="modal-button simple--button"onClick={()=>setConfirmModal(!confirmModal)} >x</button>
      </div>}
      
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
            {errors.newurl && 
            <button onClick={()=>clearErrors()}>
              <div className='form--message-errors'><p >{errors.newurl.message}</p></div>
            </button> }

            <input type="submit" className='modify--button simple--button' value={t("buttons.send")}/>
        </form>}
    </div>
  );
}
