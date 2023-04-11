import axios from "axios";
const postLogin = async (username, password) => {
  const body = { username, password };
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, body, { headers: { "Access-Control-Allow-Origin": "http://localhost:3000" } });
  return response
}
export default postLogin;