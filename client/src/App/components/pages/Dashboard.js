import "../../assets/styles/Dashboard.scss";
import HeaderLogo from "../nested/HeaderLogo";
import DashboardMasonry from "../nested/DashboardMasonry";
import { useHistory } from "react-router-dom";
import { useRef } from "react";

const Dashboard = () => {
  const history = useHistory();
  const myRef = useRef(null);
  const buyFormSubmit = (e) => {
    if (e.key !== "Enter") {
      return;
    }
    const value = e.target.value;
    console.log(value);
    if (isURL(value)) {
      const urlObject = new URL(value);
      history.push(`/post/${urlObject.pathname.split("/")[4]}`);
    } else {
      history.push(`/post/${value}`);
    }
  };

  function isURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  const buyForm = (
    <div>
      <p>
        <b className="enticingHeader">Want to own a RedditPost?</b>
      </p>
      <input
        type="text"
        className="buyForm"
        onKeyUp={buyFormSubmit}
        placeholder="Paste reddit post url here!"
      ></input>
    </div>
  );

  return (
    <div>
      <div>
        <HeaderLogo scrollTo={myRef} />
        {buyForm}
        <DashboardMasonry />
      </div>
    </div>
  );
};

export default Dashboard;
