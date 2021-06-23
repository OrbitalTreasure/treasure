import { useEffect } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";
import HeaderLogo from "../nested/HeaderLogo";

const Profile = () => {
  const { tokens } = useContext(TokenContext);

  return (
    <div>
      <HeaderLogo />
      <h1>This is a profile page {tokens.username}</h1>
      <input type="button" onClick={() => console.log(tokens)}></input>
    </div>
  );
};

export default Profile;
