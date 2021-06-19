import logo from "../../assets/images/treasureLogo.png";
import "../../assets/styles/HeaderLogo.scss";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";
const HeaderLogo = () => {
  const { tokens } = useContext(TokenContext);
  return (
    <div className="logoContainer">
      <img className="logo" src={logo}></img>
      <a href="/login" className="loginProfile">
        Login
      </a>
    </div>
  );
};

export default HeaderLogo;
