import React, { useEffect, useState } from "react";
import Web3 from "web3";

const SignMessagePage = () => {
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  // Function to sign the custom message
  const signMessage = async (message) => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);

        // Request account access
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
        setSignature(signature);
      } else {
        setError("Please install MetaMask to sign messages.");
      }
    } catch (error) {
      setError(
        "Error while signing message. Please check your MetaMask setup."
      );
      console.error(error);
    }
  };

  useEffect(() => {
    const customMessage =
      "Welcome to the META Questboard, please sign this message to verify your identity. Your custom message is: s54EJlXfiQjByYULJTQRZQwIAzPmK_zpFomwzRgnxWLM5wklZFhPwOkGVTALYry2";
    signMessage(customMessage);
  }, []);

  async function check() {
    var signing_address = await web3?.eth?.personal?.ecRecover(
      customMessage,
      signature
    );
    console.log(signing_address);
  }

  function Metalog(e) {

    console.log();
  }

  return (
    <div>
      <h1>Sign Message with MetaMask</h1>
      {signature ? (
        <div>
          <p>Message successfully signed!</p>
          <p>Signature: {signature}</p>
          <button
            className={"bg-black text-white py-1 px-1 mt-1"}
            onClick={() => {
              check();
            }}
          >
            EC Recover
          </button>
        </div>
      ) : (
        <p>Signing the message...</p>
      )}
      {error && <p>Error: {error}</p>}

      
    </div>
  );
};

export default SignMessagePage;
