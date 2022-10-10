import axios from "axios";
const postNewUrl = async (body) => {
    console.log(body);
    const response = await axios.post(`http://localhost:3001/api/users/newregister`,body);
     console.log(response)
    return response
}
  export default postNewUrl;