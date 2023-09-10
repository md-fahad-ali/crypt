import React, { useEffect, useState, useRef } from "react";
import Web3 from "web3";
import { useWeb3Modal, useWeb3ModalEvents } from "@web3modal/react";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";

function LogWeb3Button(props) {
  // console.log(props);

  const { connector: activeConnector, isConnected, address } = useAccount();
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(isConnected);
  const [sig, setSig] = useState(true);
  const [error, setError] = useState();

  const router = useRouter();

  useEffect(() => {
    props?.setCsrfToken(props.csrfToken);
  }, []);

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

  const { disconnect } = useDisconnect();

  useEffect(() => {
    disconnect();
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // console.log(props?.lock_key?.message_key);

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

  async function submitBtn(signature, fromAddress, retryCount = 0) {
    try {
      const res = await axios.get(`${props.api_url}/auth/login`, {
        withCredentials: true,
      });
      props?.setCsrfToken(res.data?.csrfToken);

      const response = await axios.post(
        `${props.api_url}/auth/login/web3`,
        {
          sig: signature,
          hash: props?.lock_key?.message_key,
          address: fromAddress,
          fromSig: props?.fromSig,
          csrfToken: props?.csrfToken,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": props?.csrfTokenForHeader,
            origin: "http://localhost:3000",
          },
        }
      );
      const { data } = response;
      console.log("Response Data:", data);
      console.log(response?.status);
      if (data.isAuth) {
      router.push("/")
      }
      if (response?.status === 200) {
        // console.log(`new Token: ${data.csrfToken}`);
        props?.setCsrfToken(data.csrfToken);
        
      }
    } catch (error) {
      console.log("Error:", error);
      // If CSRF token validation failed, get a new token and reattempt
      if (error?.response?.status != 403) {
        setError(
          error?.response?.request?.response
            ?.split(":")[1]
            ?.split("}")[0]
            ?.split('"')[1]
        );
      }
    }
  }

  const signMessage = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        const message = `${process.env.NEXT_PUBLIC_MESSAGE} ${props?.lock_key?.message_key}`;
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          props.setError("No account found in MetaMask.");
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
        submitBtn(signature, fromAddress, retryCount);

        console.log("amake deka jasse");
      } else {
        props.setError("Please install MetaMask to sign messages.");
      }
    } catch (error) {
      console.log(error);
      console.error(error?.response?.data);
      props?.setError(
        error?.response?.request?.response
          ?.split(":")[1]
          ?.split("}")[0]
          ?.split('"')[1]
      );
      props.setError("Error while signing the message.");
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
