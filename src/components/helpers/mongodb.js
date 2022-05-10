import axios from "axios";
import { Auth } from 'aws-amplify';

const postNewUrl = async (body) => {
    console.log(body);
    const response = await axios.post(`http://localhost:3001/api/users/newregister`,body);
    console.log(response)
    return response
}

const getLongUrl = async (shorturl) => {
    console.log('en getlongurl')
    console.log(shorturl)
    const response = await axios.get(`http://localhost:3001/api/users/yus/${shorturl}`);
     
    return response
}

const modifyUrl = async (id,newshorturl) => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    console.log(token.jwtToken);
    const response = await axios.put(`http://localhost:3001/api/logged/users/modify/${id}/${newshorturl}`,{data:{}}, 
    { headers: {Authorization : `${token.jwtToken}`} });
    return response
}
const deleteUrl = async (body) => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    console.log(token.jwtToken);
    const response = await axios({
    method: 'delete', //you can set what request you want to be
    url: `http://localhost:3001/api/logged/users/delete`,
    data: {body},
    headers: {
        Authorization : `${token.jwtToken}`
    }
  })
  return response
}


export {
     postNewUrl,
     getLongUrl,
     deleteUrl,
     modifyUrl
}