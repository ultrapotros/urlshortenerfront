import { useParams , useNavigate } from "react-router-dom";
import { useEffect , useState } from 'react';
import { getLongUrl } from "../helpers/mongodb";
import { useTranslation } from "react-i18next";


export default function Redirect() {
  const [modal,setModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [t] = useTranslation("global");
  const navigate = useNavigate();

    const {shortid} = useParams();
    const handleredirect = async ()=> {
        await getLongUrl(shortid)
          .then((data)=> {
            const newurl = data.data;
            window.location.href=`https://${newurl}/`
          })
          .catch(()=> {
            setErrorMessage(t("modals.not_found"))
            setModal(true)
          })
    }

    const handleModal = ()=> {
      setModal(false)
      navigate(`/`)
    }

    useEffect(() => {
         handleredirect();
    }, [])
    return <div>
        <h1>Redirecting...</h1>
        {modal && <div className="errors-modal"><p className="modal-text">{errorMessage}</p><button className="modal-button simple--button" onClick={handleModal} >x</button></div>}
    </div>
}