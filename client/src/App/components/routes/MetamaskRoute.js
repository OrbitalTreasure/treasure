import { Route, Redirect } from "react-router";
import { useEffect, useState } from "react";
import { checkAllMetamaskConditions } from "../../assets/utility/metamaskUtil";

const MetamaskRoute = ({ component: Component, ...rest }) => {
  var [loading, setLoading] = useState(true);
  var [metamaskSuccessful, setMetamaskSuccessful] = useState(false);

  const checkLogin = () => {
    return window.localStorage.getItem("tokens") != undefined;
  };

  const checkMetamask = () => {
    return (
      window.localStorage.getItem("metamask") !== undefined &&
      metamaskSuccessful
    );
  };

  useEffect(() => {
    checkAllMetamaskConditions("ropsten")
      .then((state) => {
        if (state.every(x => x)) {
          setMetamaskSuccessful(true);
        }
        setLoading(false);
      })
      .catch(console.log);
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

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
