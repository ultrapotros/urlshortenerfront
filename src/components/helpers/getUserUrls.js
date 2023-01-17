import axios from "axios";
const getUserUrls = async (username,token) => {
  console.log(token)
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/logged/urls/${username}/all`, 
    { headers: {"Authorization" : `${token}`,"Access-Control-Allow-Origin": "http://localhost:3000"} });
    return response
}
  export default getUserUrls;