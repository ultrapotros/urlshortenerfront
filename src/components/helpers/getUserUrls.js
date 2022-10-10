import axios from "axios";
const getUserUrls = async (username,token) => {
    console.log('en getuserurls')
    console.log(username)
    console.log(token)
    
    /* const response = await axios.get(`http://localhost:3001/api/logged/users/${username}/all`); */
    /* const response = await axios.get(`http://localhost:3001/api/logged/users/${username}/all`, 
    { headers: {"Authorization" : `${token}`} }); */
    const response = await axios.get(`http://localhost:3001/api/logged/urls/${username}/all`, 
    { headers: {"Authorization" : `${token}`} });
     console.log(response)
    return response
}
  export default getUserUrls;