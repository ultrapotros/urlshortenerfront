import axios from "axios";
const modifyUrl = async (id,newshorturl, token) => {
  
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/logged/urls/modify/${id}/${newshorturl}`, {data:newshorturl},
    { headers: {"Authorization" : `${token}`} });
    return response
}
  export default modifyUrl;