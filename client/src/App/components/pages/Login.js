import axios from "axios";

const Login = (props) => {
  const redirectToLogin = (e) => {
    const pathname = props?.location?.state?.from?.pathname;
    const queryAddition = pathname ? `?state=${pathname}` : "";
    axios
      .get(`/api/v1/getAuthUrl${queryAddition}`)
      .then((url) => window.open(url.data))
      .catch(console.log);
  };

  return (
    <div>
      <div className="card">
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
      </div>
    </div>
  );
};

export default Login;
