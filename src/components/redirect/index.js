import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import getLongUrl from "../helpers/getLongUrl";

export default function Redirect() {
  const { shortid } = useParams();
  console.log(shortid)
  const handleredirect = async () => {
    await getLongUrl(shortid)
      .then((data) => {
        const newurl = data.data;
        const originalUrl = newurl.split('://');
        window.location.assign(originalUrl)
        /* window.location.href = originalUrl[1]; */
      })
      .catch((error) => {
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