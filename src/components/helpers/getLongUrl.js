import axios from "axios";
const getLongUrl = async (shorturl) => {
    console.log('en getlongurl')
    console.log(shorturl)
    const response = await axios.get(`http://localhost:3001/api/users/tadu/${shorturl}`);
     
    return response
}
  export default getLongUrl;