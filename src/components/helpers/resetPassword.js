import axios from "axios";
const resetPassword = async (password, token) => {
    console.log(password,token)
    const response = await axios.post(`http://localhost:3001/api/users/resetpassword`, {data:password},
    { headers: {"Authorization" : `${token}`} });
        
    return response
}
  export default resetPassword;