import "../../assets/styles/ProfileButton.scss";
import { useContext, useEffect, useRef, useState } from "react";
import img from "../../assets/images/profileLogo.png";
import { useHistory } from "react-router-dom";
import { TokenContext } from "../../contexts/TokenContext";

const ProfileButton = (props) => {
  var [dropdown, setDropdown] = useState(false);
  const { tokens, setTokens } = useContext(TokenContext);
  const dropdownRef = useRef();
  const history = useHistory();

  const dropdownHandler = (e) => {
    toggleDropdown(dropdown);
  };

  const toggleDropdown = (dropdown) => {
    if (dropdown) {
      return setDropdown(false);
    }
    return setDropdown(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (dropdownRef.current.contains(target)) {
        return;
      }
      if (dropdown) {
        toggleDropdown(dropdown);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setDropdown, dropdown]);

  return (
    <div class="dropdown" ref={dropdownRef}>
      <img
        src={img}
        className={`dropbtn profileLogo ${dropdown ? "greyedOut" : ""}`}
        onClick={dropdownHandler}
      ></img>
      <div id="myDropdown" className={`dropdown-content ${dropdown ? "show" : ""}`}>
        <a href="#" onClick={() => history.push(`/user/${tokens.username}`)}>
          Collection
        </a>
        <a href="#" onClick={() => history.push("/offers")}>Offers</a>
        <a
          href="#"
          onClick={() => {
            localStorage.clear();
            setTokens({});
            history.push("/")
          }}
        >
          Logout
        </a>
      </div>
    </div>
  );
};

export default ProfileButton;
