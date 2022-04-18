import axios from "axios";
const getUserUrls = async (username) => {
    console.log('en getuserurls')
    console.log(username)
    const response = await axios.get(`http://localhost:3001/api/users/${username}/all`);
     
    return response
}
  export default getUserUrls;