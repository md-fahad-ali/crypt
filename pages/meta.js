import { doubleCsrfToken } from "@/lib/csrf";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import React from "react";
import { uuid } from "uuidv4";

function Meta(props) {
  console.log(props);
  async function submitForm(e) {
    e.preventDefault();
    try {
      const result = await axios.post(
        "/api/create",
        {
          csrfToken: props?.csrfToken,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-csrf-token": props?.csrf,
          },
        }
      );

      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h1>Hello World!</h1>
      <button
        onClick={(e) => {
          submitForm(e);
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default Meta;

export const getServerSideProps = async ({ req, res }) => {
  const t = getCookie("csrf-token", { req, res });
  // doubleCsrfToken(req, res, next);
  
  // console.log(meta_key);
  const ck = t?.length || 0;
  if (ck == 0) {
    doubleCsrfToken(req, res);
    console.log("cookie set");
  }
  try {
    const check = process.env.NODE_ENV == "development";
    const test = await axios.get(
      check
        ? `${req.headers["x-forwarded-proto"]}://${req.headers.host}/api/create`
        : `${process.env.WEB_URL}/api/create`,
      {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );
      
    // console.log(" from getServerSideProps ");
    // console.log(req.session);

    return {
      props: {
        csrf: getCookie("csrf-token", { req, res }) || {},
        csrfToken: test.data?.csrfToken || null,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
};
