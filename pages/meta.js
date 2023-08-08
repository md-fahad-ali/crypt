import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import React from "react";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, useAccount, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import Web3Button from "./components/Web3Button";
import { getHash } from "@/lib/hash";
import { uuid } from "uuidv4";
import { WalletConnectModalAuth } from "@walletconnect/modal-auth-react";

function Meta(props) {
  // console.log(props);

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
    <div>
      <h1>Hello World!</h1>
      <WagmiConfig config={wagmiConfig}>
        <Web3Button lock_key={sec_key} />  
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        themeVariables={{
          "--w3m-font-family": "Roboto, sans-serif",
          "--w3m-accent-color": "black",
          "--w3m-background-color":"#CECECE"
        }}
        ethereumClient={ethereumClient}
      />
    </div>
  );
}

export default Meta;

export async function getServerSideProps({ req, res }) {
  const csrfToken = getCookie("_csrf", { req, res }) || "";
  const meta_key = await getHash();

  if (!csrfToken) {
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

    return {
      props: {
        data: test.data,
        csrf: getCookie("_csrf", { req, res }) || {},
        message_key: meta_key?.length != 0 ? meta_key : ":)",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
