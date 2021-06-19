import axios from "axios";
const Snoowrap = require("snoowrap");

const Login = () => {
  const redirectToLogin = (e) => {
    axios
      .get("/api/v1/getAuthUrl")
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
