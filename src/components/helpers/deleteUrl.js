import axios from "axios";
const deleteUrl = async (body) => {
    console.log(body);
    const response = await axios.delete(`http://localhost:3001/api/users/delete`,{data: body});
     
    return response
}
  export default deleteUrl;