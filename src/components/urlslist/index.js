import { getUrls , isSession /* , modifyUrl */} from '../helpers/cognito';
import { deleteUrl , modifyUrl }from '../helpers/mongodb';
import { useContext , useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import './urlslist.css';

export default function Urls() {
    const [user, setUser] = useContext(Context);
    const [logged, setLogged] = useContext(Context);
    const [urls, setUrls] = useState();
    const [isurls,setIsurls] = useState(false);
    const [modal,setModal] = useState(false);
    const [modify,setModify] = useState(false);
    const [urlindex,setUrlindex] = useState();
    const [t] = useTranslation("global");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    console.log(user);
  
 
    const handleButton = ()=> {
        navigate(`/${user.username}/profile`)
    }

    const handleUrls = async () => {
      try {
        const data = await getUrls(user.username)
        setUrls(data.data.userurls)
        setIsurls(true)
        
      }
      catch (err) {
        console.log('en catch')
        setIsurls(false)}
    }
      
    const handleModify = async (i)=> {
      setUrlindex(i);
      setModify(true);
    }
    
    const handleModal = ()=> {
        setModal(false)
    }

    const handleDelete = async (id)=> {
      const body = {"_id":id}
      console.log(body)
      await deleteUrl(body).then(()=>{
        setModal(true)
        handleUrls();
      })
      .catch((err)=>{
        console.log(err)
      })
    }

    const onSubmit = async (data) => {
      await modifyUrl(urls[urlindex]._id, data.newurl )
          .then (() => {
              setModify(false);
              handleUrls();
          })
    };
    useEffect(async () => {
      await handleUrls();
    }, [])  
    
    return (
    
      <div className='container'>
      <h1 className='urls-main--title'>{t("urlslist.title")}</h1>
      <main className='personal-urls'>
        {isurls? <div className='long-urls'>
          <div className='personal-urls--tittles'>
              <h3 className='title-b'> {t("urlslist.longurls")}</h3>
              <h3 className='title-b'> {t("urlslist.shorturls")}</h3>
              <h3 className='title-b'> {t("urlslist.clicks")}</h3>
              <h3 className='title-b'></h3>
          </div>
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
      {modal && <div className="modal"><p className="modal-text">{t("modals.deleted")}</p><button onClick={handleModal} >x</button></div>}
      {modify && <form className='form--login' onSubmit={handleSubmit(onSubmit)} >
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
            {errors.newurl && <div className='form--message-errors'><p >{errors.newurl.message}</p></div>}

            <input type="submit" className='login--button' value={t("buttons.send")}/>
        </form>}
    </div>
  );
}
