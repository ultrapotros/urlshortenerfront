import axios from "axios";
const postNewUrl = async (body) => {
  console.log(body)
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/urls/newregister`,body);
    console.log(response)
    return response
}
  export default postNewUrl;