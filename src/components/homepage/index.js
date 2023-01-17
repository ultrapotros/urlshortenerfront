import './homepage.css'
import postNewUrl from '../helpers/postNewUrl';
import { useContext, useState} from 'react';
import  CopyToClipboard  from 'react-copy-to-clipboard';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const [user, setUser] = useContext(Context);
  const [logged, setLogged] = useContext(Logged);
  const [viewmodal, setViewmodal] = useState(false);
  const [created, setCreated] = useState(false);
  const [shorturl, setShorturl] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({defaultValues:{url:''}});
  const [t] = useTranslation("global");

  const handleNewUrl = async (data)=> {

    const body = {                      
        username: logged? user.user.username : '',
        url: data.url
    }
    const response = await postNewUrl(body)
    console.log(response)
    setShorturl(`https://urlshortenerfront-cjv1m61m4-ultrapotros.vercel.app/yus/${response.data.shorturl}`);
    setViewmodal(true);
    if (response.data.createdAt)setCreated(true);
    console.log(shorturl)
    /* if (response.data.message==='Successfully shortened')setCreated(true); */
    
  }
  const handleModal =  ()=> {
    setViewmodal(false);
    reset({
      url: ''
    })
  }
 
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
          <form className='card' onSubmit={handleSubmit(handleNewUrl)}>
            <input /* ref={inputRef} */ type="text" className='input' placeholder='URL' {
              ...register("url",
              {
                required: { value: true, message: `${t("formserrors.required")}` },
/*                 pattern: { value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, message: `${t("formserrors.wrongformat")}` }
 */                /* para comenzar la expresión regular usamos /^ y para terminarla $/ */
              })} />
                        {errors.url && <div className='form--message-errors'><p>{errors.url.message}</p></div>}
            <input className="nbutton" type="submit" value={t("buttons.send")}/>
          </form>
          {viewmodal && <div className="modal">
              {created?             
              <CopyToClipboard text={shorturl} onCopy={handleModal}>
                <div className='copy-div'><p className="copy>">{t("modals.shortened")}{shorturl}</p>
                <button className="copy">{t("buttons.copy")}</button></div>
              </CopyToClipboard> : 
              <p className="modal-content">{t("modals.alreadyshortened")}</p>}
              <div /* className="modal-button" */><button className="modal-button" onClick={handleModal}>x</button></div>
               {/* <div className="modal-button" ><button className="modal-button" onClick={()=>setViewmodal(false)}>x</button></div>  */}
          </div>}
        </div>
      </main>
    </div>
  );
}