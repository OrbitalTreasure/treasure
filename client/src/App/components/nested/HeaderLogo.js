import logo from "../../assets/images/treasureLogo.png";
import "../../assets/styles/HeaderLogo.scss";
const HeaderLogo = () => {
  return (
    <div className="logoContainer">
      <img className="logo" src={logo}></img>
      <a href="/login" className="loginProfile">Login</a>
    </div>
  );
};

export default HeaderLogo;
