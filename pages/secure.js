import axios from "axios";
import React, { useEffect, useState } from "react";

function Secure(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    //  console.log(props);
    (async () => {
      try {
        const request = await axios.get("http://127.0.0.1:3000/api/create", {
          headers: {
            origin: "http://localhost:3000",
            Cookie: props?.cookie,
          },
          withCredentials: true,
        });
        console.log(request.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [props?.cookie]);

  return (
    <div>
      <h1 className="text-white">Secure</h1>
      {data && (
        <div>
          Data from the server:
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Secure;

export const getServerSideProps = async ({ req, res }) => {
  try {
    const url = "http://localhost:3000/api/create"; // URL of the API endpoint

    // Define the request headers
    const headers = {
      origin: "http://localhost:3000",
    };

    // Make the GET request using Axios
    const requests = await axios.get(url, { headers });
    console.log(requests.data);
    return {
      props: {
        data: requests.data,
        cookie: req.headers.cookie,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
