import "../../assets/styles/HomepageLogo.scss";
import logo from "../../assets/images/treasureLogo.png";

const HomepageLogo = (props) => {
  return (
    <div className="homepageLogoContainer">
      <div className="verticallyAlign">
        <img className="homepageLogo" src={logo}></img>
        <div className="homepageTagline">OWN A PIECE OF HISTORY</div>
        <div className="actionButtons">
          <input
            type="button"
            value="Get Started"
            className="mainButton"
            onClick={() => props.scrollTo.current.scrollIntoView()}
          ></input>
          <input
            type="button"
            value="Learn More"
            className="secondaryButton"
          ></input>
        </div>
      </div>
    </div>
  );
};

export default HomepageLogo;
