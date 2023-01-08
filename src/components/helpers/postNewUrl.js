import axios from "axios";
const postNewUrl = async (body) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/newregister`,body);
    return response
}
  export default postNewUrl;