import { useEffect } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";
import HeaderLogo from "../nested/HeaderLogo";

const Profile = () => {
  var isLoggedIn;
  const { tokens } = useContext(TokenContext);
  useEffect(() => {
    isLoggedIn = tokens == {} ? false : true;
    console.log(tokens);
  }, [tokens]);

  return (
    <div>
      <HeaderLogo />
      <h1>This is a profile page {isLoggedIn + ""}</h1>
      <input type="button" onClick={() => console.log(tokens)}></input>
    </div>
  );
};

export default Profile;
