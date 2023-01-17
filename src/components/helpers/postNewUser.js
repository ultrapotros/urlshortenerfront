import axios from "axios";
const postNewUser = async (body) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/newuser`,body);
    return response
}
  export default postNewUser;
