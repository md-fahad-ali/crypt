import useSWR from "swr";
import axios from "axios";

export async function useCsrf() {
  const result = await axios.get("/api/csrf", { withCredentials: true });
  console.log(result.data);
  return result.data;
}
