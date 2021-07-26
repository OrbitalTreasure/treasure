import { Route, Redirect } from "react-router";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";

const MetamaskRoute = ({ component: Component, ...rest }) => {
  const { tokens, metamaskAccount } = useContext(TokenContext);

  const checkLogin = () => {
    return (
      window.localStorage.getItem("tokens") != undefined
    );
  };

  const checkMetamask = () => {
    return (
      (metamaskAccount ||
        window.localStorage.getItem("metamask") !== undefined) &&
      typeof window.ethereum != "undefined" &&
      window.ethereum.isMetaMask
    );
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        if (checkLogin() && checkMetamask()) {
          return <Component {...props} />;
        } else if (!checkLogin()) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        } else {
          return (
            <Redirect
              to={{ pathname: "/metamask", state: { from: props.location } }}
            />
          );
        }
      }}
    />
  );
};

export default MetamaskRoute;
