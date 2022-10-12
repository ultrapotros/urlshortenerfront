import axios from "axios";
const postNewUser = async (body) => {
    const response = await axios.post(`http://localhost:3001/api/users/newuser`,body);
   /*  await axios.get(`http://localhost:3001/api/users/byusername/'${body.username}'`); */
    return response
}
  export default postNewUser;
