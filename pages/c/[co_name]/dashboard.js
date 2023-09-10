import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { getHash } from "@/lib/hash";
import Link from "next/link";
import { uuid } from "uuidv4";
import { useRouter } from "next/router";
import CreateCommunity from "@/pages/components/create_community";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Twirl as Hamburger } from "hamburger-react";

function Dashboard(props) {
  console.log(props?.csrfForHeader);

  const router = useRouter();

  // console.log(props?.data?.pag e_data);
  console.log(props?.data?.isJoined);
  const [isJoined, setIsJoined] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isHamOpen, setHamOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [connection, setConnection] = useState([]);
  const [modal, setModal] = useState(false);

  console.log("isJoined", isJoined.length > 0);

  useEffect(() => {
    const Auth = props?.data?.session?.passport?.user ? true : false;
    setIsAuth(Auth);
    setConnection(props?.data?.connection);
    setIsJoined(props?.data?.isJoined);
  }, [
    props?.data?.session?.passport?.user,
    props?.data?.connection[0],
    props?.data?.joined[0],
  ]);

  function FindData(e) {
    console.log(e);
    const connections = props?.data?.connection;

    const result = connections.filter((el) => {
      const result = el?.company_name.toLowerCase().indexOf(e?.toLowerCase());
      if (result != -1) {
        // console.log(el);
        return el;
      } else if (e?.length == 0) {
        // console.log(el);
        return null;
      } else {
        setConnection(null);
      }
    });
    setConnection(result);
  }

  async function joinConnection(e) {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${props?.api_url}/c/${router.query?.co_name}`,
        {
          withCredentials: true,
        }
      );

      const result = await axios.post(
        `${props?.api_url}/c/add`,
        {
          company_name: props?.data?.page_data?.name,
          company_slug: props?.data?.page_data?.slug,
          company_picture: props?.data?.page_data?.image,
          csrfToken: res.data?.csrfToken,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-csrf-token": props?.csrfForHeader,
          },
        }
      );
      console.log(result.data ? true : false);

      console.log(result.data);
      setIsJoined(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function leaveConnection(e) {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${props?.api_url}/c/${router.query?.co_name}`,
        {
          withCredentials: true,
        }
      );

      const result = await axios.delete(`${props?.api_url}/c/leave`, {
        data: {
          company_slug: props?.data?.page_data?.slug,
          csrfToken: res.data?.csrfToken,
        },
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-csrf-token": props?.csrfForHeader,
        },
      });

      console.log(result.data);
      setIsJoined(false);
    } catch (error) {
      console.log(error);
    }
  }

  // console.log(connection);
  return (
    <Flowbite theme={{ dark: true }}>
      <div>
        <nav class="bg-white dark:bg-zinc-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-zinc-600 sm:hidden">
          <div class="max-w-screen-xl flex flex-wrap items-center justify-start gap-[10px] mx-auto p-2">
            <button
              className={
                "text-white focus:bg-zinc-800 p-1 scale-[0.59] block sm:hidden"
              }
            >
              <Hamburger toggled={isHamOpen} toggle={setHamOpen} />
            </button>
            <a href="https://flowbite.com/" class="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                class="h-8 mr-3"
                alt="Flowbite Logo"
              />
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Flowbite
              </span>
            </a>
          </div>
        </nav>

        <aside
          id="default-sidebar"
          className={`fixed flex top-[71px] sm:top-0 left-0 bg-gray-50 dark:bg-transparent z-40 w-80 h-screen transition-transform ${
            isHamOpen ? "" : "-translate-x-full"
          } sm:translate-x-0`}
          aria-label="Sidebar"
        >
          <div
            className={`h-full flex overflow-y-hidden transition-all duration-300 `}
            style={isOpen ? { width: "inherit" } : { width: "auto" }}
          >
            <ul className=" bg-black space-y-2 py-4 items-center font-medium flex p-3 flex-col">
              <li>
                <a href="#" className="flex">
                  <Image
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="h-8"
                    alt="Flowbite Logo"
                    width={50}
                    height={40}
                  />
                  <span
                    className={`${
                      !isOpen ? "hidden" : "block"
                    } self-center text-2xl font-semibold whitespace-nowrap dark:text-white`}
                  >
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
                  onChange={(e) => {
                    FindData(e.target.value);
                  }}
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
                    setConnection(props?.connection);
                  }}
                >
                  <IoIosArrowBack />
                </button>

                <br />
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
                  <br />
                </li>
              ) : (
                ""
              )}

              {!isOpen ? (
                <li>
                  <button
                    onClick={(e) => {
                      isAuth ? setModal(true) : router.push("/auth/login");
                    }}
                  >
                    <AiOutlinePlus className="dark:text-white text-5xl bg-slate-600 rounded-2xl p-3" />
                  </button>
                  <br />
                </li>
              ) : (
                ""
              )}

              <hr />
              {isAuth ? (
                <ul className="overflow-scroll no-scrollbar">
                  {/* {connection?.length == 0 ? (
                    <div>
                      <h1 className="text-white">Not Found</h1>
                    </div>
                  ) : (
                    connection?.map((e, i) => (
                      <li key={i}>
                        <div className="flex gap-5 items-center">
                          <Link href={`/c/${e?.company_slug}/dashboard`}>
                            <Image
                              src={e?.company_picture}
                              className={" max-w-[3.5rem] rounded-lg border-2"}
                              alt="wallet"
                              width={100}
                              height={100}
                            />
                          </Link>
                          {!isOpen ? (
                            ""
                          ) : (
                            <h1 className="text-white">{e?.company_name}</h1>
                          )}
                        </div>

                        <br />
                      </li>
                    ))
                  )} */}

                  {connection?.map((e, i) => (
                    <li key={i}>
                      <Link href={`/c/${e?.company_slug}/dashboard`}>
                        <div className="flex gap-5 items-center">
                          <Image
                            src={`${e?.company_picture}`}
                            className={" max-w-[3.5rem] rounded-lg border-2"}
                            alt="wallet"
                            width={100}
                            height={100}
                          />
                          {!isOpen ? (
                            ""
                          ) : (
                            <h1 className="text-white">{e?.company_name}</h1>
                          )}
                        </div>
                      </Link>
                      <br />
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </ul>

            {!isOpen ? (
              <ul className="bg-black ml-3 space-y-2 w-screen font-medium">
                <li className="">
                  {/* <div
                    className={`h-auto bg-cover max-w-full overflow-hidden bg-green-50`}
                  >
                    <Image
                      src={`${props?.data?.page_data?.image}`}
                      className=""
                      alt={props?.data?.page_data?.name}
                      width={0}
                      height={0}
                      layout="responsive"
                    />
                    <div
                      className=" bottom-0 px-4 h-full flex items-end py-3 w-full"
                      style={{
                        background:
                          "repeating-linear-gradient(358deg, black, transparent 257px)",
                      }}
                    >
                      <h1 className="text-white font-semibold">
                        {props?.data?.page_data?.name}
                      </h1>
                    </div>
                  </div> */}
                  <div class="h-[auto] w-[100%] relative">
                    <Image
                      src={`${props?.data?.page_data?.image}`}
                      className=""
                      alt={props?.data?.page_data?.name}
                      width={0}
                      height={0}
                      layout="responsive"
                    />
                    <div
                      className="absolute bottom-0 px-4 py-3 h-full flex items-end w-full"
                      style={{
                        background:
                          "repeating-linear-gradient(358deg, black, transparent 257px)",
                      }}
                    >
                      <h1 className="text-white font-semibold ">
                        {props?.data?.page_data?.name}
                      </h1>
                    </div>
                  </div>
                  <div>
                    <br />
                    <ul className="text-white flex flex-col pl-4 pt-5">
                      <li>
                        <Link
                          href={"#"}
                          className=" p-3 rounded-l-xl hover:bg-slate-800 w-full block"
                        >
                          Dashboard
                        </Link>
                      </li>

                      <li>
                        <Link
                          href={"#"}
                          className="p-3 rounded-l-xl hover:bg-slate-800 w-full block"
                        >
                          Completed Task
                        </Link>
                      </li>
                      {!props?.data?.created_by ? (
                        !isJoined ? (
                          <li>
                            <button
                              href={"#"}
                              style={{ textAlign: "initial" }}
                              onClick={(e) => {
                                isAuth
                                  ? joinConnection(e)
                                  : router.push("/auth/login");
                              }}
                              className="p-3 rounded-l-xl hover:bg-slate-800 w-full block"
                            >
                              Join the Community
                            </button>
                          </li>
                        ) : (
                          <li>
                            <button
                              href={"#"}
                              style={{ textAlign: "initial" }}
                              onClick={(e) => {
                                leaveConnection(e);
                              }}
                              className="p-3 text-red-600 rounded-l-xl hover:bg-slate-800 w-full block"
                            >
                              Leave the Community
                            </button>
                          </li>
                        )
                      ) : (
                        ""
                      )}
                    </ul>
                  </div>
                </li>
              </ul>
            ) : (
              ""
            )}
          </div>
        </aside>

        {/* {modal ? (
          <div>
            <CreateCommunity props={props} setModal={setModal} />
          </div>
        ) : (
          ""
        )} */}

        <div className="p-4 sm:ml-80">
          <h1 className="text-white">
            
          </h1>
        </div>
      </div>
      <ToastContainer />
    </Flowbite>
  );
}

export default Dashboard;

export async function getServerSideProps(context) {
  const { req, res } = context;
  const t = getCookie("uniqueId", { req, res });
  const ck = t?.length || 0;
  if (ck == 0) {
    setCookie("uniqueId", uuid(), {
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
    const test = await axios.get(
      `${process.env.WEB_URL}/c/${context?.query?.co_name}`,
      {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie,
          origin: "http://localhost:3000",
        },
      }
    );

    console.log("test data ", test.data);

    return {
      props: {
        data: test.data,
        api_url: process.env.WEB_URL,
        csrfForHeader: getCookie("uniqueId", { req, res }),
      },
    };
  } catch (error) {
    return {
      props: {
        data: {},
        api_url: process.env.WEB_URL,
      },
    };
  }
  // console.log(process.env.WEB_URL);
}
