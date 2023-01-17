import axios from "axios";
const resetPassword = async (password, token) => {
    console.log(password,token)
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/resetpassword`, {data:password},
    { headers: {"Authorization" : `${token}`} });
        
    return response
}
  export default resetPassword;