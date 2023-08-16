import React, { useState } from "react";
import Nav from "../../components/nav";
import axios from "axios";
import { useCsrf } from "@/lib/csrf";
import { getCookie, setCookie } from "cookies-next";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { getHash } from "@/lib/hash";

function Dashboard(props) {
  const [isOpen, setIsOpen] = useState(false);
  console.log(props);
  const array = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  return (
    <Flowbite theme={{ dark: true }}>
      <div>
        <aside
          id="default-sidebar"
          class="fixed flex top-0 left-0 bg-gray-50 dark:bg-slate-900 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div
            class={`h-full flex overflow-y-hidden transition-all duration-300 `}
            style={isOpen ? { width: "inherit" } : { width: "auto" }}
          >
            <ul class="space-y-2 py-4 items-center font-medium flex p-3 flex-col">
              <li>
                <a href="#" className="flex">
                  <Image
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="h-8"
                    alt="Flowbite Logo"
                    width={50}
                    height={40}
                  />
                  <span className={`${!isOpen ? "hidden":"block"} self-center text-2xl font-semibold whitespace-nowrap dark:text-white`}>
                    Flowbite
                  </span>
                </a>
              </li>
              
              <li
                className="flex relative top-3 transition-all border-slate-500 border-2 origin-top-left transform-cpu duration-150"
                style={
                  !isOpen
                    ? {
                        height: "0px",
                        transform: "scaleX(0)",
                        width: "0px",
                        borderRadius: "10px",
                      }
                    : { transform: "scaleX(1) scaleY(1)" }
                }
              >
                <br />
                <input
                  type="search"
                  name="search"
                  placeholder="Search Community"
                  className="w-full text-white focus:outline-none focus:border-transparent focus:ring-1 focus:ring-transparent
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                  invalid:border-pink-500 invalid:text-pink-600
                  focus:invalid:border-pink-500 focus:invalid:ring-pink-500 border-r-0 bg-transparent transition-all duration-150"
                />
                <button
                  className="text-white p-1"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  <IoIosArrowBack />
                </button>
                
                <br/>
              </li>
              {!isOpen ? (
                <li>
                  <button
                    onClick={(e) => {
                      setIsOpen(!isOpen);
                    }}
                  >
                    <BiSearch className="dark:text-white text-5xl bg-slate-600 rounded-2xl p-3" />
                  </button>
                  <br/>
                </li>
              ) : (
                ""
              
              )}
              
              <hr />
              <ul className="overflow-scroll no-scrollbar">
                {array.map((e, i) => (
                  <li key={i}>
                    <div className="flex">
                      <Image
                        src={"/WalletConnect.png"}
                        className={" max-w-[5rem]"}
                        alt="wallet"
                        width={100}
                        height={100}
                      />
                      {!isOpen ?"" : <h1 className="text-white">Hello World!</h1>}
                    </div>
                    <br />
                  </li>
                ))}
              </ul>
            </ul>
            {!isOpen ? (
              <ul class="space-y-2 pr-2 w-screen bg-black pt-4 font-medium">
                <li className="w-1/3">
                  <Image
                    src={"/WalletConnect.png"}
                    className=""
                    alt="wallet"
                    width={100}
                    height={100}
                  />
                </li>
              </ul>
            ) : (
              ""
            )}
          </div>
        </aside>

        <div class="p-4 sm:ml-64"></div>
      </div>
    </Flowbite>
  );
}

export default Dashboard;

export async function getServerSideProps(context) {
  const { req, res } = context;

  console.log(context.query || "nai");
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
        ? `${req.headers["x-forwarded-proto"]}://${req.headers.host}/api/c/${context?.query?.co_name}/details`
        : `${process.env.WEB_URL}/api/c/${context?.query?.co_name}/details`,
      {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );

    return {
      props: {
        data: test?.data?.csrf || null,
        all: test?.data?.session || null,
        csrf: getCookie("_csrf", { req, res }) || {},
        details: test?.data?.user_details || null,
        connection: test?.data?.user_connection || null,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
