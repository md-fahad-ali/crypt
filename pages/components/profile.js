import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { uuidv4 } from "uuidv4";
import Nav from "./nav";
import { useRouter } from "next/router";

function Profile(props) {
  const user = props?.data;
  const { toggle, setToggle } = props;

  const router = useRouter();
  const [acc, setAcc] = useState("");
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState(false);

  // if (props?.data?.session?.passport) {
  // } else {
  //   try {
  //     router.push("/auth/login");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // useEffect(() => {
  //   setOpen(localStorage.getItem("open"));
  //   setUser(props?.data?.session?.passport?.user);
  //   return () => {};
  // }, [props]);

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

  console.log(user);
  return (
    <div>
      <div className="">
        <div
          id="defaultModal"
          tabIndex="-1"
          aria-hidden="true"
          style={{ backgroundColor: "#16161fb3" }}
          className={`${
            toggle ? "flex" : "hidden"
          } top-0 fixed left-0 right-0 justify-center z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-0rem)] max-h-full`}
        >
          <div className="relative p-4 w-full max-w-6xl max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative mt-10 bg-white rounded-lg shadow dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="defaultModal"
                  onClick={() => {
                    setToggle(!toggle);
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <div className="p-6 flex justify-center space-y-6">
                <form className="md:w-1/2">
                  <div className="mb-6">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Username
                    </label>
                    <input
                      type="username"
                      id="username"
                      value={user?.username || ""}
                      className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@flowbite.com"
                      value={user?.info || ""}
                      required
                    />
                  </div>

                  <div className="flex">
                    <input
                      type="disabled"
                      id="website-admin"
                      value={acc || ""}
                      style={{
                        borderRadius: "7px 0px 0px 7px",
                        borderRight: "none",
                      }}
                      className="rounded-none outline-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Bonnie Green"
                    />
                    <button
                      style={{
                        borderLeft: "none",
                        borderRadius: "0px 7px 7px 0px",
                      }}
                      className="inline-flex active:bg-slate-900 items-center px-3 text-sm text-gray-900 border border-r-0 border-gray-300 rounded-l-md  dark:text-gray-400 bg-slate-800 dark:border-gray-600"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                  <br />
                  <button
                    type="submit"
                    className="text-white bg-slate-800 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-slate-800 dark:hover:bg-slate-900 dark:focus:ring-slate-600"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    Update
                  </button>
                </form>
              </div>
              {/* <!-- Modal footer --> */}
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;