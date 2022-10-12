import axios from "axios";
const forgotPassword = async (email) => {
    console.log(email)
  const response = await axios.post(`http://localhost:3001/api/users/forgotpassword`,email);
      
  return response
}
  export default forgotPassword;