import axios from "axios";
const forgotPassword = async (email) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/forgotpassword`, email);
  return response
}
export default forgotPassword;