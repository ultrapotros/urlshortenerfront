import axios from "axios";
const postLogin = async (username,password) => {
  const body = {username,password};
  console.log(body)
  const response = await axios.post(`http://localhost:3001/api/login`,body);
      
  return response
}
  export default postLogin;