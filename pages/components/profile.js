import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { uuidv4 } from "uuidv4";
import Nav from "./nav";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import Web3 from "web3";
import { useWeb3Modal, useWeb3ModalEvents } from "@web3modal/react";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";

function Profile(props) {
  // console.log(props?.data);
  const user = props?.csrf?.data?.data[0] || null;
  const { toggle, setToggle, csrf } = props;

  const router = useRouter();
  const [acc, setAcc] = useState("");
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");

  const { connector: activeConnector, isConnected, address } = useAccount();
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(isConnected);
  const [sig, setSig] = useState(true);
  const [errorEmail, setEmailError] = useState();
  const [errorUser, setUsernameError] = useState();
  const [errorWallet, setWalletError] = useState();

  const [addresses, setAddresses] = useState();
  const [signatures, setSignatures] = useState();
  const [onProfile, setOnProfile] = useState(true);
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
    // const getAccount = async () => {
    //   try {
    //     const account = await window.ethereum.request({
    //       method: "eth_accounts",
    //     });
    //     setAcc(account.toString());
    //     console.log(account.toString());
    //   } catch (error) {
    //     setErr(true);
    //   }
    // };

    // getAccount();

    // console.log(acc);
    console.log(address, isConnected);

    isConnected ? setAcc(address) : setAcc("");

    setAcc(user?.wallet_address || address);
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setFirst_name(user?.first_name || "");
    setLast_name(user?.last_name || "");
  }, [
    user?.email,
    user?.first_name,
    user?.info,
    user?.last_name,
    user?.name,
    user?.username,
  ]);

  async function updateData(e) {
    e.preventDefault();
    console.log("props.data", props.data);
    try {
      // console.log(props?.api_url);
      const res = await axios.get(`${props?.api_url}/profile/update`, {
        withCredentials: true,
      });

      console.log(res.data, process.env.WEB_URL);
      if (res.data?.session?.passport) {
        const result = await axios.post(
          `${props?.api_url}/profile/update`,
          {
            email: e.target.email.value,
            username: e.target.username.value,
            first_name: e.target.first_name.value,
            last_name: e.target.last_name.value,
            wallet_address: e.target.wallet_address.value,
            csrfToken: res.data.csrfToken,
          },
          {
            withCredentials: true,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-csrf-token": props?.csrf?.csrfForHeader,
            },
          }
        );

        console.log(result);
        if (result.data === 1) {
          toast.success("Updated data sucessfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("Can't update the data", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        if (result?.data?.error) {
          result?.data?.data == "email"
            ? setEmailError(result?.data?.error)
            : "";

          result?.data?.data == "wallet_address"
            ? setWalletError(result?.data?.error)
            : "";
        } else if (result?.data?.type == 2) {
          setEmailError(result?.data?.error);
          setWalletError(result?.data?.error);
        }
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const web3Modal = useWeb3Modal({
    cacheProvider: true,
    providerOptions: {},
  });

  const isExist = useAccount({
    onConnect({ address, connector, isReconnected }) {
      !connected ? signMessage() : "nope";

      console.log(address);
    },
  });

  const signMessage = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        const message = `${process.env.NEXT_PUBLIC_MESSAGE} ${props?.hash}`;
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          toast.error("No account found in MetaMask.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          return;
        }
        const fromAddress = accounts[0];
        const signature = await web3.eth.personal.sign(
          message,
          fromAddress,
          ""
        );

        let retryCount = 0;
        console.log(signature, fromAddress, message);
        setAddresses(fromAddress);
        setSignatures(signature);
        setAcc(fromAddress);

        console.log("amake deka jasse");
      } else {
        toast.error("Please install MetaMask to sign messages.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setError("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while signing the message.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const connectToWallet = async (e) => {
    console.log("client connect");
    e.preventDefault();
    // console.log(process.env.NEXT_PUBLIC_MESSAGE);
    // console.log(props?.hash);
    try {
      const provider = await web3Modal.open();

      const web3Instance = new Web3(provider);

      setWeb3(web3Instance);
      setConnected(isConnected);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  // console.log(props);
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
            <div className="relative border-neutral-600 mt-10 bg-white rounded-lg shadow dark:bg-zinc-800">
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
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-[250px] border-b border-zinc-700 flex flex-row sm:flex-col w-full">
                  <button
                    className={
                      "p-3 text-white focus:bg-neutral-700 sm:rounded-r-md rounded-none w-full"
                    }
                    onClick={() => {
                      setOnProfile(true);
                    }}
                  >
                    Profile Setting
                  </button>
                  <button
                    className={
                      "p-3 text-white focus:bg-neutral-700 sm:rounded-r-md rounded-none w-full"
                    }
                    onClick={() => {
                      setOnProfile(false);
                    }}
                  >
                    Linked account
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className="p-6 w-full flex justify-center space-y-6">
                  {onProfile ? (
                    <form
                      className="md:w-1/2"
                      onSubmit={(e) => {
                        updateData(e);
                      }}
                    >
                      <div className="mb-6">
                        <div className="flex justify-between">
                          <label
                            htmlFor="firstname"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your Firstname
                          </label>
                        </div>
                        <input
                          type="firstname"
                          id="firstname"
                          name="first_name"
                          defaultValue={first_name}
                          onChange={(e) => {
                            setFirst_name(e.target.value);
                          }}
                          // value={first_name || ""}
                          className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <div className="flex justify-between">
                          <label
                            htmlFor="firstname"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your Lastname
                          </label>
                        </div>
                        <input
                          type="lastname"
                          id="lastname"
                          name="last_name"
                          defaultValue={last_name}
                          onChange={(e) => {
                            setLast_name(e.target.value);
                          }}
                          // value={last_name || ""}
                          className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <div className="flex justify-between">
                          <label
                            htmlFor="firstname"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your Username
                          </label>
                          <p className="text-red-700 text-center">
                            {errorUser}
                          </p>
                        </div>
                        <input
                          type="username"
                          id="username"
                          name="username"
                          // value={username || ""}
                          defaultValue={username || ""}
                          onChange={(e) => {
                            setUsername(e.target.value);
                          }}
                          className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <div className="flex justify-between">
                          <label
                            htmlFor="firstname"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your Email
                          </label>
                          <p className="text-red-700 text-center">
                            {errorEmail}
                          </p>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="name@flowbite.com"
                          // value={email || ""}
                          defaultValue={email || ""}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          required
                        />
                      </div>

                      <div className="flex">
                        {acc ? (
                          <div className="flex w-full flex-col">
                            <div className="flex justify-between">
                              <label
                                htmlFor="wallet_address"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Your wallet
                              </label>
                              <p className="text-red-700 text-center">
                                {errorEmail}
                              </p>
                            </div>
                            <div className="flex">
                              <input
                                type="text"
                                id="website-admin"
                                readOnly="readOnly"
                                name="wallet_address"
                                defaultValue={acc || ""}
                                style={{
                                  borderRadius: "7px 0px 0px 7px",
                                  borderRight: "none",
                                }}
                                className="rounded-none outline-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter your wallet address"
                              />
                              <button
                                style={{
                                  borderLeft: "none",
                                  borderRadius: "0px 7px 7px 0px",
                                }}
                                className="inline-flex active:bg-slate-900 items-center px-3 text-sm text-gray-900 border border-r-0 border-gray-300 rounded-l-md  dark:text-gray-400 bg-transparent dark:border-gray-600"
                                onClick={(e) => {
                                  e.preventDefault();
                                }}
                              >
                                Disconnect
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex w-full">
                            <div className="flex justify-between">
                              <label
                                htmlFor="wallet_address"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Your Email
                              </label>
                              <p className="text-red-700 text-center">
                                {errorEmail}
                              </p>
                            </div>

                            <input
                              type="text"
                              id="website-admin"
                              readOnly="readOnly"
                              name="wallet_address"
                              defaultValue={acc || ""}
                              style={{
                                borderRadius: "7px 0px 0px 7px",
                                borderRight: "none",
                              }}
                              className="rounded-none outline-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Enter your wallet address"
                            />
                            <button
                              style={{
                                borderLeft: "none",
                                borderRadius: "0px 7px 7px 0px",
                              }}
                              className="inline-flex active:bg-slate-900 items-center px-3 text-sm text-gray-900 border border-r-0 border-gray-300 rounded-l-md  dark:text-gray-400 bg-transparent dark:border-gray-600"
                              onClick={(e) => {
                                connectToWallet(e);
                              }}
                            >
                              Connect
                            </button>
                          </div>
                        )}
                      </div>
                      <br />
                      <button
                        type="submit"
                        className="text-white bg-neutral-950 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-neutral-950 dark:hover:bg-natural-900 dark:focus:ring-slate-600"
                      >
                        Update
                      </button>
                    </form>
                  ) : (
                    <form
                      className="md:w-1/2"
                      onSubmit={(e) => {
                        updateData(e);
                      }}
                    >
                      <div className="mb-6">
                        <div className="flex justify-between">
                          <label
                            htmlFor="firstname"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your Discord
                          </label>
                        </div>
                        <input
                          type="firstname"
                          id="firstname"
                          name="first_name"
                          defaultValue={first_name}
                          onChange={(e) => {
                            setFirst_name(e.target.value);
                          }}
                          // value={first_name || ""}
                          className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <div className="flex justify-between">
                          <label
                            htmlFor="firstname"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your Twitter
                          </label>
                        </div>
                        <input
                          type="lastname"
                          id="lastname"
                          name="last_name"
                          defaultValue={last_name}
                          onChange={(e) => {
                            setLast_name(e.target.value);
                          }}
                          // value={last_name || ""}
                          className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                      </div>

                      <br />
                      <button
                        type="submit"
                        className="text-white bg-neutral-950 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-neutral-950 dark:hover:bg-natural-900 dark:focus:ring-slate-600"
                      >
                        Update
                      </button>
                    </form>
                  )}
                </div>
              </div>
              {/* <!-- Modal footer --> */}
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-black"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
