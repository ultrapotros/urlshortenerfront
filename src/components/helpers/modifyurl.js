import axios from "axios";
const modifyUrl = async (id,newshorturl, token) => {
  
    const response = await axios.put(`http://localhost:3001/api/logged/urls/modify/${id}/${newshorturl}`, {data:newshorturl},
    { headers: {"Authorization" : `${token}`} });
    return response
}
  export default modifyUrl;