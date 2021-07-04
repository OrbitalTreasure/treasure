import axios from "axios";
import "../../assets/styles/Login.scss";

const Login = (props) => {
  const url = new URLSearchParams(window.location.search);
  const error = url.get("error");
  const redirectToLogin = (e) => {
    const pathname = props?.location?.state?.from?.pathname;
    const search = props?.location?.state?.from?.search;
    const queryAddition =
      pathname || search ? `?state=${pathname}${search}` : "";
    axios
      .get(`/api/v1/getAuthUrl${queryAddition}`)
      .then((url) => window.open(url.data))
      .catch(console.log);
  };

  return (
    <div>
      <div className="container">
        <h2>
          <b>Please Login to Continue</b>
        </h2>
        <p>
          To access more features of Treasure, pleae login with your{" "}
          <b>Reddit Account</b>
        </p>
        <input
          type="button"
          value="Login with Reddit"
          onClick={redirectToLogin}
        />
        <p>
          We use your Reddit account to verify your ownership over your posts
        </p>
        {error && <h4 className="loginError">An error has occured: {error}</h4>}
      </div>
    </div>
  );
};

export default Login;
