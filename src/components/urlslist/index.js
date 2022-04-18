import getUserUrls from '../helpers/getUserUrls';
import deleteUrl from '../helpers/deleteUrl';
import { useContext , useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../App';
import { useForm } from 'react-hook-form';
import './urlslist.css';

export default function Urls() {
  const [user, setUser] = useContext(Context);
  const [urls, setUrls] = useState();
  const [isurls,setIsurls] = useState(false);
  const [modal,setModal] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  console.log(user);
  
  const handleurls = async ()=> {
    await getUserUrls(user.username)
      .then((data)=> {
        console.log(data.data.userurls)
        return (data.data.userurls)
      })
      .catch((error)=> {
        console.log(error)
      })
  }
 
/*     const loggedUserJSON = window.localStorage.getItem('userlogged');
    const loggedUser= JSON.parse(loggedUserJSON); */
/*     const userdata = {                      
        username: user.username,
        email: user.email,
        premium: user.premium,
        password: user.password,
    } */
    const handleButton = ()=> {
        navigate(`/${user.username}/profile`)
    }

    useEffect(async () => {
        console.log('dentro del useEffect del urlslist')
        await getUserUrls(user.username)
            .then((data)=> {
                console.log(data.data.userurls)
                setUrls(data.data.userurls)
                setIsurls(true)
            })   
            .catch((error) => {
                console.log(error)
                setIsurls(false)
            })      
    }, [modal])

    const handleModify = ()=> {
        console.log('modifica boton')
    }
    
    const handleModal = ()=> {
        setModal(false)
    }

    const handleDelete = async (shorturl)=> {
        console.log('borra boton')
        const body = {"shorturl":shorturl}
        await deleteUrl(body).then((data)=>{
            setModal(true)
            console.log(data)
        })
        .catch((err)=>{
          console.log(err)
        })
    }
 
  return (
    
    <div className='container'>
      <h1 className='title'>Mis URLs</h1>
      <main className='personal-urls'>
        {isurls && <div className='long-urls'>
          <h2 className='title-b'> URLs Originales</h2>
            <ul className='urls-list'>
                {urls.map((element, index)=> <li key={index} className='urls-list-row'><div className='urls-list-column'>{element.url}</div><div className='urls-list-column'>{element.shorturl}</div><div className='urls-list-column'>{element.clicksCounter}</div>
                <div className='urls-list-buttons'><button clasName='delete-url' onClick={handleModify}>Modificar</button>
                <button clasName='delete-url' onClick={()=>handleDelete(element._id)}>Borrar</button></div></li>)}
            </ul>
        </div>}
      </main>
      <button onClick={handleButton} >Volver</button>
      {modal && <div className="modal"><p className="modal-text">Registro borrado</p><button onClick={handleModal} >x</button></div>}
    </div>
  );
}
