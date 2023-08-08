import React, { useEffect, useState, useRef } from "react";
import Web3 from "web3";
import { useWeb3Modal, useWeb3ModalEvents } from "@web3modal/react";
import { useAccount, useBalance, useConnect } from "wagmi";
import Image from "next/image";
import axios from "axios";

function LogWeb3Button(props) {
  const { connector: activeConnector, isConnected, address } = useAccount();
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(isConnected);
  const [sig, setSig] = useState(true);
  const [error, setError] = useState();
  const {
    data,
    isFetching,
    isSuccess,
    isError,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
  } = useBalance({
    address,
  });
  const [items, setItems] = useState([]);
  //   const [ isShow,setIsShow] = useState(false)

  const web3Modal = useWeb3Modal({
    cacheProvider: true,
    providerOptions: {},
  });

  // console.log(props?.lock_key);

  const connectToWallet = async (e) => {
    e.preventDefault();

    try {
      const provider = await web3Modal.open();

      const web3Instance = new Web3(provider);

      setWeb3(web3Instance);
      setConnected(isConnected);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  console.log(props?.lock_key?.message_key);

  const signMessage = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        const message = `${process.env.NEXT_PUBLIC_MESSAGE} ${props?.lock_key?.message_key}`;
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          setError("No account found in MetaMask.");
          return;
        }
        const fromAddress = accounts[0];
        const signature = await web3.eth.personal.sign(
          message,
          fromAddress,
          ""
        );

        // try {
        //   const result = await axios.post(
        //     "/api/auth/metamask/register",
        //     {
        //       address: fromAddress,
        //       sig: signature,
        //       _csrf: props?.lock_key?.data,
        //       hash: props?.lock_key?.message_key,
        //     },
        //     {
        //       withCredentials: true,
        //       headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //         "xsrf-token": props?.lock_key?.csrf,
        //       },
        //     }
        //   );
        //   console.log("From server");
        //   console.info(result.data);

        // } catch (error) {
        //   console.log(error);
        // }

        try {
          const result = await axios.post(
            "/api/auth/login",
            {
              _csrf: props?.lock_key?.data,
              sig: signature,
              hash: props?.lock_key?.message_key,
              address: fromAddress,
              fromSig:props?.fromSig
            },
            {
              withCredentials: true,
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "xsrf-token": props?.lock_key?.csrf,
              },
            }
          );
          // setMsg(result.data);
          console.log(result.data);
        } catch (error) {
          console.log(error);
        }

        console.log("amake deka jasse");
      } else {
        setError("Please install MetaMask to sign messages.");
      }
    } catch (error) {
      setError("Error while signing the message.");
      console.error(error);
    }
  };

  const isExist = useAccount({
    onConnect({ address, connector, isReconnected }) {
      const isSig = localStorage.getItem("isSig");
      !connected ? signMessage() : "nope";

      // console.log(isSig);
    },
  });

  // console.log(isExist?.address == undefined);
  isExist?.address == undefined
    ? () => {
        localStorage.setItem("isSig", true);
      }
    : "";

  useEffect(() => {
    // console.log(localStorage.getItem("isSig"));
  });

  return (
    <>
      <button
        aria-label="Continue with WalletConnect"
        role="button"
        onClick={(e) => {
          connectToWallet(e);
        }}
        // style={show ? { display: "none" } : { display: "flex" }}
        className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10"
      >
        <Image
          src="/WalletConnect.png"
          alt="WalletConnect"
          width={50}
          height={50}
        />
        <p className="text-base font-medium ml-4 text-white">
          Continue with WalletConnect
        </p>
      </button>
    </>
  );
}

export default LogWeb3Button;
