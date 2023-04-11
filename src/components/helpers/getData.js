import axios from "axios";
const getData = async (id, type) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/${type}/${id}`);
  return response
}
export default getData;