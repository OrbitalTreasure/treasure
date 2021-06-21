import { Route, Redirect } from "react-router-dom";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";

const LoginRoute = ({ component: Component, ...rest }) => {
  const { tokens } = useContext(TokenContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (Object.keys(tokens).length != 0) {
          return <Component {...props} />;
        } else {
          return <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />;
        }
      }}
    />
  );
};

export default LoginRoute;
