import { Route, Redirect } from "react-router-dom";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";

const LoginRoute = ({ component: Component, ...rest }) => {
  const { tokens } = useContext(TokenContext);
  const checkLogin = () => {
    return (
      Object.keys(tokens).length !== 0 ||
      window.localStorage.getItem("tokens") !== undefined
    );
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        if (checkLogin()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
      }}
    />
  );
};

export default LoginRoute;
