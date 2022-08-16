import axios from "axios";
import { Auth } from 'aws-amplify';

/* const URL = "http://localhost:3001"; */
/* const URL = "https://13.38.229.214"; */
/* const URL = "https://ec2-13-38-229-214.eu-west-3.compute.amazonaws.com"; */
const URL = "https://young-dusk-42461.herokuapp.com";

const postNewUrl = async (body) => {
    const response = await axios.post(`${URL}/api/urls/newregister`,body);
    return response
}

const getUrls = async () => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    const userdatas = await Auth.currentUserInfo();//gets logged users data
    const response = await axios.get(`${URL}/api/logged/urls/${userdatas.username}/all`, 
    { headers: {"Authorization" : `${token.jwtToken}`} });
    return (response)
}

const getLongUrl = async (shorturl) => {
    const response = await axios.get(`${URL}/api/urls/yus/${shorturl}`);
     
    return response
}

const modifyUrl = async (id,newshorturl) => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    const response = await axios.put(`${URL}/api/logged/urls/modify/${id}/${newshorturl}`,{data:{}}, 
    { headers: {Authorization : `${token.jwtToken}`} });
    return response.data.message
}
const deleteUrl = async (body) => {
    const userdata = await Auth.currentSession();
    const token = userdata.getAccessToken();
    const response = await axios({
    method: 'delete', //you can set what request you want to be
    url: `${URL}/api/logged/urls/delete`,
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