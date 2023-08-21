import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import Nav from "./components/nav";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";

import User from "./components/user";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props) {
  // console.log(web3);
  // console.log(props?.data?.data[0]?.wallet_address || null);
  // console.log(props?.data?.csrfToken);

  // For toogle
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setErr] = useState(false);
  const [address, setAddress] = useState(
    // props?.data?.data[0]?.wallet_address || null
  );

  const [ profileOpen, setProfileOpen ] = useState(false);

  // const toggleProfile = () => {
  //   setProfileOpen((profileOpen) => !profileOpen);
  // };
  const toggleProfile = () => {
    console.log("Toggling profile!"); // Debugging line
    setProfileOpen((profileOpen) => !profileOpen);
  };

  const toggleModal = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const [acc, setAcc] = useState();
  const router = useRouter();
  const [user, setUser] = useState("");
  if (props?.data?.session?.passport) {
  } else {
    try {
      router.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const getAccount = async () => {
      try {
        const account = await window.ethereum.request({
          method: "eth_accounts",
        });
        setAcc(account);
        console.log(account);
      } catch (error) {
        setErr(true);
      }
    };

    getAccount();
  }, []);
  // console.log(props);
  useEffect(() => {
    setUser(props?.data?.session?.passport?.user);
    if (address) {
      setIsModalOpen(true);
      console.log("yes");
    } else {
      setIsModalOpen(false);
      console.log("no");
    }
    
    return () => {};
  }, [address, props]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav
        user={props?.data?.session?.passport ? user : "default"}
        csrf={props}
        acc={acc}
        toggle={toggleProfile}
        csrfToken={props?.data?.csrfToken}
      />
      {props?.data?.session && (
        <main className={`${styles.main} ${inter.className}`}>
          

          {/* {props?.data?.session?.passport?.user?.type == "user" ? (
            <div>
              <User data={props}/>
            </div>
          ) : (
            <div>I am company</div>
          )} */}

          <footer>
            <p>copyright @2023</p>
          </footer>
        </main>
      )}
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const csrfToken = getCookie("_csrf", { req, res }) || "";

  if (!csrfToken) {
    setCookie("_csrf", uuidv4(), {
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

  const headers = {
    "Content-Type": "application/json",
    Cookie: req.headers.cookie || "",
  };
  try {
    const check = process.env.NODE_ENV == "development";
    const test = await axios.get(
      check
        ? `${req.headers["x-forwarded-proto"]}://${req.headers.host}/api`
        : `${process.env.WEB_URL}/api`,
      {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );
    console.log(test.data);

    return {
      props: {
        data: test.data,
        csrf: getCookie("_csrf", { req, res }) || {},
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
