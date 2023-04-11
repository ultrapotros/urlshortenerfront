import axios from "axios";
const deleteUrl = async (body, token) => {
  const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/logged/urls/delete`, { headers: { "Authorization": `${token}` }, data: body });
  return response
}
export default deleteUrl;