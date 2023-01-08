import axios from "axios";
const forgotPassword = async (email) => {
    console.log(email)
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/forgotpassword`,email);
  console.log(response.data)
      
  return response
}
  export default forgotPassword;