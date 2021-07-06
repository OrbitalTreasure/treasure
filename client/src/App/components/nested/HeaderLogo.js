import logo from "../../assets/images/treasureLogo.png";
import "../../assets/styles/HeaderLogo.scss";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import ProfileButton from "./ProfileButton";

const HeaderLogo = () => {
  const { tokens } = useContext(TokenContext);
  const history = useHistory();
  const logoImg = (
    <img
      className="logo"
      src={logo}
      onClick={() => {
        history.push("/");
      }}
    ></img>
  );
  const loginProfileButton =
    Object.keys(tokens).length == 0 ? (
      <a href="/login" className="loginProfile">
        Login
      </a>
    ) : (
      <ProfileButton />
    );

  return (
    <div className="logoContainer">
      {logoImg}
      {loginProfileButton}
    </div>
  );
};

export default HeaderLogo;
