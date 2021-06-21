import HeaderLogo from "../nested/HeaderLogo";
import { useEffect, useState } from "react";
import ABI from "../../assets/TreasureTokenFactory.json";
const Web3 = require("web3");

const MetamaskLogin = () => {
  var [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);

  const linkMetamask = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
  };

//   const testFunction = async () => {
//     window.web3 = new Web3(window.ethereum);
//     var contract = await new window.web3.eth.Contract(
//       ABI.abi,
//       "0xED54AE9644E20D90c83c1597E6E6Ae112A8E9e75"
//     );
//     console.log(contract)
//   };

  useEffect(() => {
    isMetamaskInstalled = setIsMetamaskInstalled(
      typeof window.ethereum != "undefined" && window.ethereum.isMetaMask
    );
  }, [setIsMetamaskInstalled]);

  return (
    <div>
      <HeaderLogo />
      <div className="container">
        <h2>Please Connect to your MetaMask</h2>
        <p>
          In order to interact with an offer, you need to have a MetaMask wallet
          attached to your account.
        </p>
        {isMetamaskInstalled ? (
          <input
            value="Link your Metamask"
            type="button"
            onClick={linkMetamask}
          ></input>
        ) : (
          <p>Metamask is not installed</p>
        )}
        <p>Click here to learn more about MetaMask and why we use it.</p>
      </div>
    </div>
  );
};

export default MetamaskLogin;
