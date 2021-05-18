import { useContext } from "react";
import snoowrap from "snoowrap";
import Login from "./Login";
import { TokenContext } from "../contexts/TokenContext";
import PostDetailsForm from "./PostDetailsForm";

function Homepage(props) {
  const { tokens } = useContext(TokenContext);

  function getUsername() {
    if (tokens === null) {
      return "";
    }
    const r = new snoowrap({
      userAgent: "Treasure Orbital v1.0",
      clientId: "DzfZOF3d3768Yw",
      clientSecret: "sBfggKGPAq5b7IbZoYXrKmKHqoEdoA",
      accessToken: tokens?.accessToken,
      refreshToken: tokens?.refreshToken,
    });
    r.getMe()
      .then(console.log)
      .catch((e) => console.log(e));
  }

  return (
    <div className="card">
      <PostDetailsForm/>
      <br />
      <br />
      <Login />
      <input type="button" onClick={getUsername} value="Get User" />
    </div>
  );
}

export default Homepage;
