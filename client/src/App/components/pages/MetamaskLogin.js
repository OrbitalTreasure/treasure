import HeaderLogo from "../nested/HeaderLogo";
import { useEffect, useState, useContext } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
const Web3 = require("web3");

const MetamaskLogin = (props) => {
  var [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const { setMetamaskAccount, tokens } = useContext(TokenContext);
  const history = useHistory();
  const pathname = props?.location?.state?.from?.pathname;
  const search = props?.location?.state?.from?.search;
  const redirect = pathname + search || "/";

  const linkMetamask = async () => {
    const accounts = window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const mapUser = accounts
      .then((accountList) => {
        return axios.post("/api/v1/blockchain/mapUser", {
          userId: tokens.userId,
          userAddress: accountList[0],
        });
      })
      .catch((e) => Promise.resolve({}));

    Promise.all([accounts, mapUser]).then(
      ([accountList, transactionDetails]) => {
        setMetamaskAccount(accountList[0]);
        window.localStorage.setItem("metamask", accountList[0]);
        console.log(transactionDetails);
        history.push(redirect);
      }
    );
  };

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
        <input
          type="button"
          value="click"
          onClick={() => console.log(props)}
        ></input>
      </div>
    </div>
  );
};

export default MetamaskLogin;
