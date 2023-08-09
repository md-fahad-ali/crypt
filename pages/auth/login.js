import axios from "axios";
import React, { useState } from "react";
import { useCsrf } from "@/lib/csrf";
import { getCookie, setCookie } from "cookies-next";
import styles from "../../styles/register.module.css";
import Image from "next/image";
import { FaBeer, FaLongArrowAltLeft } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, useAccount, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { getHash } from "@/lib/hash";
import { uuid } from "uuidv4";
import Web3Button from "../components/Web3Button";
import LogWeb3Button from "../components/LogWeb3Button";

function Login(props) {
  console.log(props);
  const [checked, setChecked] = React.useState(true);
  const [msg, setMsg] = useState();
  const [show, setShow] = useState(false);
  const [fromSig, setFromSig] = useState(false);
  const [sig, setSig] = useState("");
  const [address, setAddress] = useState("");
  const [error,setError] = useState("");

  async function submitForm(e) {
    e.preventDefault();
    try {
      const result = await axios.post(
        "/api/auth/login",
        {
          email: e.target.email.value,
          password: e.target.password.value,
          _csrf: props?.data,
          fromSig: fromSig,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "xsrf-token": props?.csrf,
          },
        }
      );
      setError("");
      if (result.status == 200 && result?.data?.isAuth) {
        router.push("/")
      }else{
        setMsg(result.data)
      }
      console.log(result.data);
    } catch (error) {
      setError(error?.response?.request?.response?.split(":")[1]?.split("}")[0]?.split('"')[1]);
    }
  }

  // async function submitWeb3Form(e) {
  //   e.preventDefault();
  //   try {
  //     const result = await axios.post(
  //       "/api/auth/login",
  //       {
  //         _csrf: props?.data,
  //         type: e.target.type.value,
  //         sig: sig,
  //         hash: props?.message_key,
  //         address: address,
  //       },
  //       {
  //         withCredentials: true,
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //           "xsrf-token": props?.csrf,
  //         },
  //       }
  //     );
  //     // setMsg(result.data);
  //     console.log(result.data);
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // }

  //Config of WalletConnect
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const sec_key = props;

  const chains = [arbitrum, mainnet, polygon];
  const projectId = apiKey;

  const { publicClient } = configureChains(chains, [
    w3mProvider({ projectId }),
  ]);
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
  });

  const ethereumClient = new EthereumClient(wagmiConfig, chains);

  return (
    <div className={styles.formBd}>
      <div
        className={`${styles.form} bg-slate-950 max-w-xl mx-auto py-10 px-9`}
      >
        <button
          style={show ? { display: "block" } : { display: "none" }}
          type="button"
          className={"float-left relative bottom-7"}
          onClick={() => {
            setShow(false);
          }}
        >
          <FaLongArrowAltLeft className={"text-white font-bold text-2xl"} />
        </button>
        <h1
          className={
            "text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          }
        >
          Sign In
        </h1>
        <br/><p className={"text-red-600"}>{error}</p>
        {!show ? (
          <div>
            <form>
              
                <LogWeb3Button
                  lock_key={sec_key}
                  fromSig={true}
                />
             
              {/* <Web3Modal
                projectId={projectId}
                themeVariables={{
                  "--w3m-font-family": "Roboto, sans-serif",
                  "--w3m-accent-color": "black",
                  "--w3m-background-color": "#CECECE",
                }}
                ethereumClient={ethereumClient}
              /> */}

              <button
                aria-label="Continue with Web1.0"
                role="button"
                onClick={() => {
                  setShow(true);
                  setFromSig(false);
                }}
                style={show ? { display: "none" } : { display: "flex" }}
                className="focus:outline-none h-16 focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 text-white py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10"
              >
                <HiOutlineMail className={" text-3xl ml-3 "} />
                <p className="text-base font-medium ml-7 text-white">
                  Continue with Web1.0
                </p>
              </button>
            </form>
          </div>
        ) : (
          ""
        )}
        {show ? (
          <div style={show ? { dispaly: "block" } : { display: "none" }}>
            <form
              onSubmit={(e) => {
                fromSig ? submitWeb3Form(e) : submitForm(e);
              }}
            >
              <br />
              <p style={{ color: "red" }}>{msg}</p>
              <label className={"text-white float-left"}>You mail</label>
              <br />
              <input
                name="email"
                placeholder="name@company.com"
                className={
                  "p-2 text-1xl border-violet-800 text-white bg-slate-900"
                }
                required
              ></input>

              <div>
                <label className={"text-white float-left mt-4"}>
                  You password
                </label>
                <br />
                <input
                  name="password"
                  placeholder="******"
                  required
                  className={
                    "p-2 text-1xl border-violet-800 text-white bg-slate-900"
                  }
                ></input>
              </div>
              <br />
              <input type="hidden" name="_csrf" value={props.csrf} />
              <p className={"text-white float-left"}>Your motive</p>
              <br />
              <button
                type="submit"
                className="w-full text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
              >
                Sign In
              </button>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Login;

export const getServerSideProps = async ({ req, res }) => {
  const t = getCookie("_csrf", { req, res });
  const meta_key = await getHash();
  // console.log(meta_key);
  const ck = t?.length || 0;
  if (ck == 0) {
    setCookie("_csrf", uuid(), {
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
  try {
    const check = process.env.NODE_ENV == "development";
    const test = await axios.get(
      check
        ? `${req.headers["x-forwarded-proto"]}://${req.headers.host}/api/auth/login`
        : `${process.env.WEB_URL}/api/auth/login`,
      {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );
    // console.log(test.data);
    return {
      props: {
        message_key: meta_key || null,
        data: test?.data.csrf || null,
        all: test?.data?.session || null,
        csrf: getCookie("_csrf", { req, res }) || {},
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
};
