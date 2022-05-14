import axios from "axios";
import { Auth } from 'aws-amplify';

const postNewUrl = async (body) => {
    console.log(body);
    const response = await axios.post(`http://localhost:3001/api/urls/newregister`,body);
    console.log(response)
    return response
}

const getUrls = async (username) => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    const response = await axios.get(`http://localhost:3001/api/logged/urls/${username}/all`, 
    { headers: {"Authorization" : `${token.jwtToken}`} });
    return (response)
}

const getLongUrl = async (shorturl) => {
    console.log('en getlongurl')
    console.log(shorturl)
    const response = await axios.get(`http://localhost:3001/api/urls/yus/${shorturl}`);
     
    return response
}

const modifyUrl = async (id,newshorturl) => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    const response = await axios.put(`http://localhost:3001/api/logged/urls/modify/${id}/${newshorturl}`,{data:{}}, 
    { headers: {Authorization : `${token.jwtToken}`} });
    console.log(response.data.message)
    return response.data.message
}
const deleteUrl = async (body) => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    const response = await axios({
    method: 'delete', //you can set what request you want to be
    url: `http://localhost:3001/api/logged/urls/delete`,
    data: {body},
    headers: {
        Authorization : `${token.jwtToken}`
    }
  })
  return response
}


export {
     postNewUrl,
     getUrls,
     getLongUrl,
     deleteUrl,
     modifyUrl
}