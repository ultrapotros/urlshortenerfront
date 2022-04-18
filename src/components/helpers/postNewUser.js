import axios from "axios";
const postNewUser = async (body) => {
    console.log(body);
    const response = await axios.post(`http://localhost:3001/api/users/newuser`,body);
   /*  await axios.get(`http://localhost:3001/api/users/byusername/'${body.username}'`); */
     console.log(response.status);
    return response
}
  export default postNewUser;
  //hago el login directamente o obligo a volver a hacer login despues del registro????????????????