import getUserUrls from '../helpers/getUserUrls';
import deleteUrl from '../helpers/deleteUrl';
import modifyUrl from '../helpers/modifyurl';
import { useContext , useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../App';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import './urlslist.css';
/* import '../../../src/normalize.css' */

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
        navigate(`/${user.user.username}/profile`)
    }

    const handleUrls = async () => {
      await getUserUrls(user.user.username,user.token)
      .then((data)=> {
          console.log(data.data.userurls)
          setUrls(data.data.userurls)
          setIsurls(true)
        })   
        .catch((error) => {
          console.log(error)
          setIsurls(false)
        })   
    }

    useEffect(() => {
        
        handleUrls();
    }, [])
            

    const handleModify = async (i)=> {
      setUrlindex(i);
      setModify(true);
    }
    
    const handleModal = ()=> {
        setModal(false)
    }

    const handleDelete = async (shorturl)=> {
      console.log('borra boton')
      const body = {"id":shorturl}
      await deleteUrl(body,user.token).then((data)=>{
        setModal(true)
        handleUrls();
        console.log(data)
      })
      .catch((err)=>{
        console.log(err)
      })
    }

    /* const onSubmit = async (data) => {
      await modifyUrl(urls[urlindex]._id, data.newurl, user.token )
          .then ((newData) => {
              console.log('**********Onsubmit'+newData);
              if(newData.data.message === 'Already exists') console.log(newData.data.message)
              setModify(false);
              handleUrls();
          })
  }; */
  const onSubmit = async (data) => {
    try{
        const res = await modifyUrl(urls[urlindex]._id, data.newurl, user.token )
        console.log(res)
        if (res.data.message === "Already exists") {
          console.log('////////////////already exist/////////////')
          setErrorMessage(t("modals.short-exists"));
          setErrorModal(true);
        }
        else if (res.data.message === "updated") {
          console.log('////////////////updated/////////////')
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
      <h1 className='title'>{t("urlslist.title")}</h1>
      <main className='personal-urls'>
        {isurls? <div className='long-urls'>
          <h2 className='title-b'> {t("urlslist.longurls")}</h2>
            <ul className='urls-list'>
                {urls.map((element, index)=> 
                  <li key={index} className='urls-list-row'>
                    <div className='urls-list-column'>{element.url}</div>
                    <div className='urls-list-column'>{element.shorturl}</div>
                    <div className='urls-list-column'>{element.clicksCounter}</div>
                    <div className='urls-list-buttons'>
                      <button className='delete-url nbutton' onClick={()=>handleModify(index)}>{t("buttons.modify")}</button>
                      <button className='delete-url nbutton' onClick={()=>handleDelete(element._id)}>{t("buttons.delete")}</button>
                    </div>
                  </li>)}
            </ul>
        </div> : <h3>Charging...</h3>}
      </main>
      <button className="nbutton" onClick={handleButton} >{t("buttons.back")}</button>
      {errorModal && <div className="errors-modal modal"><span className="modal-text">{errorMessage}</span><button className="modal-button simple--button"onClick={()=>setErrorModal(!errorModal)} >x</button></div>}
      {confirmModal && <div className="confirm-modal modal"><span className="modal-text">{confirmMessage}</span><button className="modal-button simple--button"onClick={()=>setConfirmModal(!confirmModal)} >x</button></div>}
      {modal && <div className="modal"><p className="modal-text">{t("modals.deleted")}</p><button onClick={handleModal} >x</button></div>}
      {modify && <form className='form--login modal' onSubmit={handleSubmit(onSubmit)} >
            {/* User Name */}
            <input spellCheck="false" className='form--input' type="text" value={urls[urlindex].url} disabled{
                ...register("url")} />
            {/* User Name */}
            <input spellCheck="false" className='form--input' type="text" value={urls[urlindex].shorturl} disabled{
                ...register("shorturl")} />
                  

            {/* Password */}
            <input spellCheck="false" className='form--input' type="text" placeholder={t("form.modify")} {
                ...register("newurl",
                    {
                        required: { value: true, message: `${t("formserrors.required")}` },
                        minLength: { value: 4, message: `${t("formserrors.minlegth")}4`},
                        maxLength: { value: 8, message: `${t("formserrors.maxlength")}8` }
                    })} />
            {errors.newurl && <button onClick={()=>clearErrors()} ><div className='form--message-errors'><p >{errors.newurl.message}</p></div></button>}

            <input type="submit" className='login--button' value={t("buttons.send")}/>
        </form>}
    </div>
  );
}
