import axios from "axios";
const getUserUrls = async (username,token) => {

    const response = await axios.get(`http://localhost:3001/api/logged/urls/${username}/all`, 
    { headers: {"Authorization" : `${token}`} });
    return response
}
  export default getUserUrls;