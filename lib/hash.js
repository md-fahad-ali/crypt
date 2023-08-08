import axios from "axios";
import { uuid } from "uuidv4";

export async function getHash(req, res) {
  const check = process.env.NODE_ENV == "development";
  const url = check
    ? "http://localhost:3000/api/auth/register"
    : `${process.env.WEB_URL}/api/auth/register`;
  const result = await axios.get(url, { withCredentials: true });
  console.log(result.data);
  const data = uuid();
  return data;
}
