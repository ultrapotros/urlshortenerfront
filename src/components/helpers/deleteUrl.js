import axios from "axios";
const deleteUrl = async (body, token) => {

    const response = await axios.delete(`http://localhost:3001/api/logged/urls/delete`,{ headers: {"Authorization" : `${token}`}, data:body });
    
    return response
}
  export default deleteUrl;