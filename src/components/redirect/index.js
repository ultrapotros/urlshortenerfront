import { useParams } from "react-router-dom";
import { useEffect} from 'react';
import { getLongUrl } from "../helpers/mongodb";

export default function Redirect() {
    const {shortid} = useParams();
    const handleredirect = async ()=> {
        await getLongUrl(shortid)
          .then((data)=> {
            const newurl = data.data;
            window.location.href=`https://${newurl}/`
          })
          .catch((error)=> {
            console.log(error)
          })
      }
      useEffect(() => {
         handleredirect();
    }, [])
    return <div>
        <h1>Redirecting...</h1>
    </div>
}