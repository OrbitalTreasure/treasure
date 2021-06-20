import logo from "../../assets/images/treasureLogo.png";
import "../../assets/styles/HeaderLogo.scss";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";
const HeaderLogo = () => {
  const { tokens } = useContext(TokenContext);
  const logoImg = <img className="logo" src={logo}></img>;
  const loginProfileButton = Object.keys(tokens).length == 0 ? (
    <a href="/login" className="loginProfile">
      Login
    </a>
  ) : (
    <a href="/profile" className="loginProfile">
      Profile
    </a>
  );

  return (
    <div className="logoContainer">
      {logoImg}
      {loginProfileButton}
    </div>
  );
};

export default HeaderLogo;
