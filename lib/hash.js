import axios from "axios";
import { uuid } from "uuidv4";

export async function getHash(req, res) {
  const check = process.env.NODE_ENV == "development";
  const data = uuid();
  return data;
}
