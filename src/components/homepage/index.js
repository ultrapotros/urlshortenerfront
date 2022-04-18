import './homepage.css'
import postNewUrl from '../helpers/postNewUrl';
import { useContext, useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';
import  CopyToClipboard  from 'react-copy-to-clipboard';
import { Context } from '../../App';
import { Logged } from '../../App';
import { useForm } from 'react-hook-form';

export default function HomePage() {
  const [user, setUser] = useContext(Context);
  const [logged, setLogged] = useContext(Logged);
  const [viewmodal, setViewmodal] = useState(false);
  const [created, setCreated] = useState(false);
  const [shorturl, setShorturl] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const handleNewUrl = async (data)=> {
    const body = {                      
        username: logged? user.username : '',
        url: data.url
    }
    data.url='';
    await postNewUrl(body)
    .then ((newData) => {
            setShorturl(newData.data.registro.shorturl);
            setViewmodal(true);
            setCreated(true);
        })
        .catch((err) => {
          setViewmodal(true)
          console.log(err)
        })
  }
  useEffect(async () => {
    console.log('dentro del useEffect del homepage')
    console.log(viewmodal);
  
}, [shorturl, viewmodal])
 
  return (
    
    <div className='container'>
      {/* <Header /> */}
      <main className='main'>
        <h1 className='tittle'>
          URL Shortener
        </h1>

        <p className='description'>
          Acorta tus URLs aquí 
        </p>

        <div className='grid'>
          <form className='card'onSubmit={handleSubmit(handleNewUrl)}>
            <input /* ref={inputRef} */ type="text" className='input' placeholder='URL' {
              ...register("url",
              {
                required: { value: true, message: 'Campo requerido' },
                pattern: { value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, message: "Formato no correcto" }
                /* para comenzar la expresión regular usamos /^ y para terminarla $/ */
              })} />
                        {errors.url && <div/*  className='login--message-errors' */><p>{errors.url.message}</p></div>}
            <input className="button" type="submit"/>
          </form>
          {viewmodal && <div className="modal">
              {created?             
              <CopyToClipboard text={shorturl} onCopy={() => setViewmodal(false)}>
                <div><p className="copy>">Esta es tu url recortada: {shorturl}</p>
                <button className="copy">Copy</button></div>
              </CopyToClipboard> : 
              <p className="modal-content">Ya se ha recortado esa url</p>}
              <button className="modal-button" onClick={()=>setViewmodal(false)}>x</button>
          </div>}
        </div>
      </main>
    </div>
  );
}