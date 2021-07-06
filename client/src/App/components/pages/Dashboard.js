import "../../assets/styles/Dashboard.scss";
import HeaderLogo from "../nested/HeaderLogo";
import DashboardMasonry from "../nested/DashboardMasonry";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const history = useHistory();
  const buyFormSubmit = (e) => {
    if (e.key != "Enter") {
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
        <b>Want to own a RedditPost?</b>
      </p>
      <input type="text" className="buyForm" onKeyUp={buyFormSubmit} placeholder="https://www.reddit.com/user/El-Ricardo/comments/odf8ru/"></input>
    </div>
  );

  return (
    <div>
      <HeaderLogo />
      {buyForm}
      <DashboardMasonry />
    </div>
  );
};

export default Dashboard;
