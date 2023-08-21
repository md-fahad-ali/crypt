import React, { useEffect, useState } from "react";
import Nav from "../../components/nav";
import axios from "axios";
import { useCsrf } from "@/lib/csrf";
import { getCookie, setCookie } from "cookies-next";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { getHash } from "@/lib/hash";
import Link from "next/link";
import { uuid } from "uuidv4";
import db from "@/pages/api/db";
import { useRouter } from "next/router";
import CreateCommunity from "@/pages/components/create_community";

function Dashboard(props) {
  const router = useRouter();

  // console.log(props);
  const [isJoined, setIsJoined] = useState(props?.joined);

  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [connection, setConnection] = useState([]);
  const [modal, setModal] = useState(false);

  const array = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  useEffect(() => {
    const Auth = props?.all?.passport?.user ? true : false;
    setIsAuth(Auth);
    setConnection(props?.connection);
    setIsJoined(props?.joined);
  }, [props?.all?.passport?.user, props?.connection, props?.joined]);

  function FindData(e) {
    console.log(e);
    const result = props?.connection?.filter((el) => {
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

  async function leaveConnection(e) {
    e.preventDefault();
    const username = props?.user_details[0]?.username || null;
    const company_slug = router?.query?.co_name;
    const company_picture = props?.page_data?.image;
    const company_name = props?.page_data?.name;
    console.log(props?.csrf, props?.data);

    try {
      const result = await axios.put(
        `/api/c/${company_slug}/details`,
        {
          username: username,
          company_slug: company_slug,
          company_picture: company_picture,
          company_name: company_name,
          _csrf: props?.data,
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

      setIsJoined(0);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function joinConnection(e) {
    e.preventDefault();
    const username = props?.user_details[0]?.username || null;
    const company_slug = router?.query?.co_name;
    const company_picture = props?.page_data?.image;
    const company_name = props?.page_data?.name;
    console.log(props?.csrf, props?.data);

    try {
      const result = await axios.post(
        `/api/c/${company_slug}/details`,
        {
          username: username,
          company_slug: company_slug,
          company_picture: company_picture,
          company_name: company_name,
          _csrf: props?.data,
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
      setIsJoined(1);
      // console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Flowbite theme={{ dark: true }}>
      <div>
        <aside
          id="default-sidebar"
          className="fixed flex top-0 left-0 bg-gray-50 dark:bg-slate-900 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div
            className={`h-full flex overflow-y-hidden transition-all duration-300 `}
            style={isOpen ? { width: "inherit" } : { width: "auto" }}
          >
            <ul className="bg-slate-950 space-y-2 py-4 items-center font-medium flex p-3 flex-col">
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
                  {connection?.length == 0 ? (
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
                  )}
                  {/* {connection?.map((e, i) => (
                    <li key={i}>
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
                      {console.log(connection)}
                      <br />
                    </li>
                  ))} */}
                </ul>
              ) : (
                ""
              )}
            </ul>
            {!isOpen ? (
              <ul className="bg-slate-950 ml-3 space-y-2 w-screen font-medium">
                <li className="">
                  <div className="h-auto max-w-full bg-green-50">
                    <Image
                      src={`${props?.page_data?.image}`}
                      className=""
                      alt={props?.page_data?.name}
                      width={0}
                      height={0}
                      layout="responsive"
                    />
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

                      {isJoined != 1 ? (
                        <li>
                          <button
                            href={"#"}
                            style={{ textAlign: "initial" }}
                            onClick={(e) => {
                              joinConnection(e);
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

        {modal ? (
          <div>
            <CreateCommunity props={props} setModal={setModal}/>
          </div>
        ) : (
          ""
        )}

        <div className="p-4 sm:ml-80">
          <h1>Hello World!</h1>
        </div>
      </div>
    </Flowbite>
    // <div>
    //   <h1>Hello World!</h1>
    // </div>
  );
}

export default Dashboard;

export async function getServerSideProps(context) {
  const { req, res } = context;
  // console.log(context);
  // console.log(context.query || "nai");
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
    console.log(
      `${req.headers["x-forwarded-proto"]}://${req.headers.host}/api/c/${context?.query?.co_name}/details`
    );
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

    console.log("from server");
    // console.log(test?.data?.session?.passport?.user?.username);
    if (test?.data?.session?.passport?.user?.username || false) {
      console.log("ase login");
      const data = await db
        .select(
          "username",
          "email",
          "wallet_address",
          "first_name",
          "last_name"
        )
        .from("auth")
        .where("username", test?.data?.session?.passport?.user?.username);
      // console.log(data);

      const connection = await db
        .select()
        .from("user_details")
        .where("username", test?.data?.session?.passport?.user?.username);

      const page_data = await db
        .select("image", "name", "slug")
        .from("company_details")
        .where("slug", context?.query?.co_name)
        .first();

      const joined = await db
        .select()
        .from("user_details")
        .where("username", test?.data?.session?.passport?.user?.username)
        .andWhere("company_name", context?.query?.co_name);

      console.log("getServerside props");
      // console.log(joined.length);
      // console.log(test?.data?.csrf);

      return {
        props: {
          data: test?.data?.csrf || null,
          all: test?.data?.session || null,
          csrf: getCookie("_csrf", { req, res }) || {},
          user_details: data,
          connection: connection,
          page_data: page_data,
          joined: joined?.length,
        },
      };
    } else {
      const page_data = await db
        .select()
        .from("company_details")
        .where("slug", context?.query?.co_name)
        .first();

      return {
        props: {
          data: test?.data?.csrf || null,
          all: test?.data?.session || null,
          csrf: getCookie("_csrf", { req, res }) || {},
          user_details: {},
          connection: {},
          page_data: page_data,
        },
      };
      console.log("nai login");
    }
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
