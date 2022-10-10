import axios from "axios";
const deleteUrl = async (body, token) => {
    console.log(body);
    console.log(token)
    const response = await axios.delete(`http://localhost:3001/api/logged/urls/delete`,{ headers: {"Authorization" : `${token}`}, data:body }
    );
    /* const response = await axios.delete(`http://localhost:3001/api/logged/users/delete`,{data: body}); */
     
    return response
}
  export default deleteUrl;