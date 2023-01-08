import axios from "axios";
const getProfileByUsername = async (username) => {
    let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/byusername/'${username}'`);
    return response;
}
  export default getProfileByUsername;