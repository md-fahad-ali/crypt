/* eslint-disable jsx-a11y/role-supports-aria-props */
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Nav.module.css";
import { Cross as Hamburger } from "hamburger-react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { Avatar, Dropdown, Navbar, Item } from "flowbite-react";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import { RxCross2 } from "react-icons/rx";
import Web3 from "web3";
import Profile from "./profile";
import { ToastContainer, toast } from "react-toastify";
import { FiLogIn } from "react-icons/fi";

const Nav = ({ csrf }) => {
  console.log();
  // console.log(csrf?.data?.session?.passport?.user);

  const user = csrf?.data?.data[0] || null;

  // console.log(user);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  // console.log(props?.user?.info);
  const [open, setOpen] = useState(false);
  const [acc, setAcc] = useState("");
  const [toggle, setToggle] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    console.log(user?.wallet_address);
    let acc = String(user?.wallet_address);
    const first = acc.slice(0, 4);
    const second = acc.slice(acc.length / 1.1, acc.length);
    setAcc(`${first}xxxxxxxxxxx${second}`);

    return () => {};
  }, [user?.wallet_address]);

  const handleButton = () => {
    setIsOpen(!isOpen);
  };

  async function logOutSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.get(`${csrf?.api_url}/auth/logout`, {
        withCredentials: true,
        origin: "http://localhost:3000",
      });
      console.log(csrf?.api_url);
      // setToken(res.data?.csrfToken);
      // console.log(res.data?.csrf, csrf?.csrfForHeader);
      console.log(res.data?.csrf);

      const result = await axios.post(
        `${csrf.api_url}/auth/logout`,
        {
          csrfToken: res.data?.csrf,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrf?.csrfForHeader,
            origin: "http://localhost:3000",
          },
        }
      );
      console.log(result.data?.success);
      if (result.data?.success) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getOption(e) {
    e.preventDefault();
    try {
      const pro = await axios.delete(`${window.origin}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(pro);
      if (pro.data) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <div>
      <Flowbite theme={{ dark: true }}>
        <nav className="w-full border-gray-200 dark:backdrop-blur-sm bg-black-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="https://flowbite.com/" className="flex items-center">
              <Image
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="Flowbite Logo"
                width={24}
                height={24}
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Flowbite
              </span>
            </a>
            <div className="flex items-center md:order-2">
              {user != null ? (
                <Dropdown
                  className={"invisible md:visible bg-black"}
                  inline
                  label={
                    <Avatar
                      alt="User settings"
                      img={`https://avatars.dicebear.com/api/bottts/${user?.info}.svg`}
                      rounded
                      className={
                        "invisible md:visible rounded-full border-4 border-slate-500"
                      }
                    />
                  }
                >
                  <div className="bg-black">
                    <Dropdown.Header className="bg-black">
                      <span className="block text-sm">
                        {user?.first_name} {user?.last_name}
                      </span>
                      <br />
                      <span className="block truncate text-sm font-medium">
                        {user?.wallet_address == null ? (
                          <button
                            className={"bg-slate-900 p-3"}
                            onClick={(e) => {
                              setToggle(!toggle);
                            }}
                          >
                            Connect wallet
                          </button>
                        ) : (
                          acc
                        )}
                      </span>
                    </Dropdown.Header>
                    <ul
                      className="py-2 bg-black"
                      aria-labelledby="user-menu-button"
                    >
                      <li class>
                        <button
                          onClick={() => {
                            setToggle(!toggle);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Profile
                        </button>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Earnings
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={(e) => {
                            logOutSubmit(e);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Log out
                        </button>
                      </li>
                    </ul>
                  </div>
                </Dropdown>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex gap-2 py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-white md:p-0 md:dark:text-white"
                  aria-current="page"
                >
                  Login
                  <FiLogIn className="text-white text-2xl" />
                </Link>
              )}
              {/* <!-- Dropdown menu --> */}

              <button
                data-collapse-toggle="navbar-user"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-user"
                aria-expanded="false"
                onClick={() => {
                  // alert(!open)
                  setOpen(!open);
                }}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>

            {/* All links of desktop view */}
            <div
              className={`items-center ${
                !open ? "w-0" : "w-full"
              } overflow-hidden justify-between transition-all duration-300 top-0 left-0 h-screen md:h-auto flex absolute md:relative md:top-0 md:left-0 w-0 md:flex md:w-auto md:order-1`}
              id="navbar-user"
            >
              <ul
                className={`flex mt-1 left-full md:left-0 transition-all duration-300 items-center w-full h-full rounded-none justify-center flex-col font-medium p-4 md:p-0 border border-gray-100 bg-zinc-900 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-zinc-90 dark:backdrop-blur-sm bg-black/30  md:dark:bg-transparent dark:border-transparent`}
              >
                <div
                  className={
                    "w-full md:hidden md:invisible flex justify-end fixed px-7 top-1"
                  }
                >
                  <button
                    className={`w-2 p-5 ${
                      !open ? "hidden" : ""
                    } text-white text-center`}
                    onClick={() => {
                      setOpen(!open);
                    }}
                  >
                    <RxCross2 className={"text-3xl"} />
                  </button>
                </div>
                <li className="md:invisible md:hidden">
                  <Image
                    className="rounded-full border-4 border-slate-500  md:invisible md:hidden cursor-pointer"
                    src={`https://avatars.dicebear.com/api/bottts/${user?.info}.svg`}
                    alt="Avtar"
                    width={100}
                    height={100}
                  />
                </li>

                <li className="md:invisible md:hidden">
                  <h1
                    className={
                      "text-4xl text-slate-500 md:invisible md:hidden text-center font-bold"
                    }
                  >
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <br />
                </li>

                <li className="md:invisible md:hidden w-1/2 text-center">
                  <button
                    className="block w-full md:hidden md:invisible py-2 pl-3 pr-4 bg-slate-600  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    onClick={() => {
                      setToggle(!toggle);
                    }}
                  >
                    Profile
                  </button>
                </li>
                <hr className="w-full border-slate-600 bg-slate-600 m-2 md:invisible md:hidden" />

                <li className="w-1/2 text-center dark:hover:bg-gray-700">
                  <Link
                    href="#"
                    className="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li className="w-1/2 text-center hover:bg-slate-900">
                  <Link
                    href="/dashboard"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="w-1/2 text-center hover:bg-slate-900">
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    About
                  </a>
                </li>

                <li className="w-1/2 text-center hover:bg-slate-900">
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Contact
                  </a>
                </li>
                <li className="w-1/2 hover:bg-slate-900 md:invisible md:hidden text-center">
                  <button
                    className="block w-full md:hidden md:invisible py-2 pl-3 pr-4 bg-slate-600  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    onClick={(e) => {
                      logOutSubmit(e);
                    }}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </Flowbite>

      <Profile
        data={user}
        hash={csrf?.hash}
        csrf={csrf}
        toggle={toggle}
        setToggle={setToggle}
        api_url={csrf?.api_url}
      />
      <ToastContainer />
    </div>
  );
};

export default Nav;
