import axios from "axios";
const getLongUrl = async (shorturl) => {

    const response = await axios.get(`http://localhost:3001/api/urls/yus/${shorturl}`);
     
    return response
}
  export default getLongUrl;