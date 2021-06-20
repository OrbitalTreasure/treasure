import { useEffect } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";
import HeaderLogo from "../nested/HeaderLogo";

const Profile = () => {
  const { tokens } = useContext(TokenContext);

  return (
    <div>
      <HeaderLogo />
      <h1>This is a profile page of {tokens.username}</h1>
    </div>
  );
};

export default Profile;
