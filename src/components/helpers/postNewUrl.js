import axios from "axios";
const postNewUrl = async (body) => {
    const response = await axios.post(`http://localhost:3001/api/users/newregister`,body);
    return response
}
  export default postNewUrl;