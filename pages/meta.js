import axios from "axios";
import React from "react";
import { getCookie, setCookie } from "cookies-next";
import { uuid } from "uuidv4";

function Meta(props) {
  console.log("Received props:", props);

  async function submitBtn(e, retryCount = 0) {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${props.api_url}/secure`,
        { csrfToken: props.test_data.csrfToken },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": props?.csrfToken,
            origin: "http://localhost:3000",
          },
        }
      );

      console.log("Response Data:", data);
      if (
        data.message === "Token submitted successfully" ||
        data.message === "New CSRF token generated"
      ) {
        props.test_data.csrfToken = data.csrfToken;
      }
    } catch (error) {
      console.log("Error:", error);
      // If CSRF token validation failed, get a new token and reattempt
      if (error?.response?.status === 403 && retryCount < 2) {
        try {
          const { data } = await axios.get(`${props.api_url}/secure`, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              origin: "http://localhost:3000",
            },
          });
          props.test_data.csrfToken = data.csrfToken;
          submitBtn(e, retryCount + 1);
        } catch (innerError) {
          console.error("Error fetching new token:", innerError);
        }
      }
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <nav className="w-full py-3 top-0 bg-opacity-70 backdrop-blur-md glass-bg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-lg font-semibold text-white">Logo</div>
          <div className="space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">Home</a>
            <a href="#" className="text-gray-300 hover:text-white">About</a>
            <a href="#" className="text-gray-300 hover:text-white">Services</a>
            <a href="#" className="text-gray-300 hover:text-white">Contact</a>
          </div>
        </div>
      </nav>
      <div className="relative pt-16 pb-32 flex flex-col items-center">
        <div className="absolute top-0 left-0 right-0 bg-opacity-50 backdrop-blur-md h-full"></div>
        <div className="w-full max-w-screen-md px-4 overflow-y-auto">
          <h1 className="text-3xl font-semibold text-white mb-4">Welcome to our website</h1>
          <p className="text-gray-300">This is the scrollable content area. Scroll down to see more content.</p>
          {/* Add more content to enable scrolling */}
          <div className="h-96 mt-4 bg-white rounded-lg shadow-md">
            {/* Add more content here */}
          </div>
        </div>
        <div className="fixed bottom-0 w-full bg-opacity-70 backdrop-blur-md py-4 text-white text-center">
          Additional content at the bottom
        </div>
      </div>
    </div>
  );
}

export default Meta;

export const getServerSideProps = async ({ req, res }) => {
  try {
    const t = getCookie("uniqueId", { req, res });

    const csrfTokenHash = uuid();

    const ck = t?.length || 0;
    if (ck == 0) {
      setCookie("uniqueId", csrfTokenHash, {
        req,
        res,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 1000,
        sameSite: "lax",
        path: "/",
      });
      console.log("cookie set");
    }

    const test_data = await axios({
      url: `${process.env.WEB_URL}/secure`,
      method: "get",
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "true",
        origin: "http://localhost:3000",
        Cookie: req.headers.cookie,
      },
    });

    console.log("Received in getServerSideProps:", test_data.data);
    const token = getCookie("uniqueId", { req, res }) || {};

    return {
      props: {
        api_url: process.env.WEB_URL,
        test_data: test_data.data,
        csrfToken: token,
      },
    };
  } catch (error) {
    console.log("Error:", error);
    return {
      props: { api_url: process.env.WEB_URL },
    };
  }
};
