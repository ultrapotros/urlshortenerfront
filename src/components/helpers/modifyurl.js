import axios from "axios";
const modifyUrl = async (id,newshorturl, token) => {
    console.log('en modifyurl')
    console.log(id, newshorturl)
    console.log(token)
    /* const response = await axios.get(`http://localhost:3001/api/${shorturl}`); */
    const response = await axios.put(`http://localhost:3001/api/logged/urls/modify/${id}/${newshorturl}`, {data:newshorturl},
    { headers: {"Authorization" : `${token}`} });
     console.log(response)
    return response
}
  export default modifyUrl;