import axios from "axios";
const getLongUrl = async (shorturl) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/urls/yus/${shorturl}`);
  return response
}
export default getLongUrl;