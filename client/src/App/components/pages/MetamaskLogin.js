import HeaderLogo from "../nested/HeaderLogo";
import { useEffect, useState, useContext } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "../../assets/styles/MetamaskLogin.scss";
import { checkAllMetamaskConditions } from "../../assets/utility/metamaskUtil";

const MetamaskLogin = (props) => {
  var [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [metamaskState, setMetamaskState] = useState([]);
  var [loading, setLoading] = useState(true);
  const { setMetamaskAccount, tokens } = useContext(TokenContext);
  const history = useHistory();
  const pathname = props?.location?.state?.from?.pathname;
  const search = props?.location?.state?.from?.search;
  const redirect = pathname + search || "/";

  const generateJSX = (props) => {
    return (
      <div>
        <HeaderLogo />
        <div className="metamaskColumn">
          <div className="container">
            <h2>{props.title}</h2>
            <p>{props.subtext}</p>
            {props.button}
            <p
              onClick={() => window.open("https://metamask.io/")}
              className="urlLink"
            >
              Click here to learn more about MetaMask and why we use it.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const getPermissions = async () => {
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

  const switchChain = () => {
    try {
      window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x3" }],
      });
    } catch (switchError) {
      console.log(switchError);
    }
  };

  const checkMetamaskState = () => {
    checkAllMetamaskConditions("ropsten").then((state) => {
      setMetamaskState(state);
      setLoading(false);
      if (metamaskState.every((x) => x)) {
        history.push(redirect)
      }
    });
  };

  useEffect(() => {
    checkMetamaskState();
  }, []);

  if (window.ethereum) {
    window.ethereum.on("chainChanged", checkMetamaskState);
    window.ethereum.on("accountsChanged", checkMetamaskState);
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!metamaskState[0]) {
    //  No metamask on browser
    const config = {
      title: "You do not have Metamask on this browser.",
      subtext: "Please download MetaMask to make transactions",
      button: (
        <input
          value="Redirect to MetaMask"
          type="button"
          onClick={() => {
            window.open("https://metamask.io/");
          }}
          className="metamaskButton"
        ></input>
      ),
    };
  }

  if (!metamaskState[1]) {
    // Not logged in
    const config = {
      title: "You are currently not logged in",
      subtext: "Please log in ",
      button: (
        <input
          value="Link your Metamask"
          type="button"
          onClick={getPermissions}
          className="metamaskButton"
        ></input>
      ),
    };
    return generateJSX(config);
  }
  if (!metamaskState[2]) {
    // No permissions
    const config = {
      title: "Please Connect to your MetaMask",
      subtext:
        "In order to interact with an offer, you need to have a MetaMask wallet attached to your account.",
      button: (
        <input
          value="Link your Metamask"
          type="button"
          onClick={getPermissions}
          className="metamaskButton"
        ></input>
      ),
    };
    return generateJSX(config);
  }

  if (!metamaskState[3]) {
    // Wrong network

    const config = {
      title: "You are on the wrong network",
      subtext:
        "Our site currently uses the Ropsten test network. Please change your network. ",
      button: (
        <input
          value="Change your Network"
          type="button"
          onClick={switchChain}
          className="metamaskButton"
        ></input>
      ),
    };
    return generateJSX(config);
  }
  return generateJSX({
    title: "Redirectng...",
    subtext:
      "Please wait while we redirect",
    button: (
      <input
        value="Click Here to Redirect Manually"
        type="button"
        onClick={() => {history.push(redirect)}}
        className="metamaskButton"
      ></input>
    ),
  });
};

export default MetamaskLogin;
